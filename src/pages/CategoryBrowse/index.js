import React, { Component } from "react";

import { CircularProgress } from "@material-ui/core";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";
import queryString from "query-string";

import { Footer, Nav, PageMenu, SortMenu, seo, theme, Tile } from "../../components";

export default class CategoryBrowse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      category: this.props.match.params.category,
      isLoaded: false,
      metadata: {},
      page: parseInt(queryString.parse(this.props.location.search).page) || 1,
      range: `${
        queryString.parse(this.props.location.search).page === undefined
          ? "0:16"
          : `${
              (parseInt(queryString.parse(this.props.location.search).page) -
                1) *
              16
            }:${
              parseInt(queryString.parse(this.props.location.search).page) * 16
            }`
      }`,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      sort:
        queryString.parse(this.props.location.search).sort || "alphabet-asc",
    };
  }

  componentDidMount() {
    let { auth, category, range, server, sort } = this.state;

    if (!auth || !server) {
      this.props.history.push("/logout");
    }

    let url = `${server}/api/v1/metadata?a=${auth}&c=${category}&r=${range}&s=${sort}`;
    axios
      .get(url)
      .then((response) =>
        this.setState({
          isLoaded: true,
          metadata: response.data.content,
          pages: Math.ceil(response.data.content[0]["length"] / 16),
        })
      )
      .catch((error) => {
        console.error(error);
        if (error.response) {
          let data = error.response.data;
          if (data.code === 401) {
            Swal.fire({
              title: "Error!",
              text: data.message,
              icon: "error",
              confirmButtonText: "Login",
              confirmButtonColor: theme.palette.success.main,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              }
            });
          } else if (!server) {
            this.props.history.push("/logout");
          } else {
            Swal.fire({
              title: "Error!",
              text: data.message,
              icon: "error",
              confirmButtonText: "Logout",
              confirmButtonColor: theme.palette.success.main,
              cancelButtonText: "Retry",
              cancelButtonColor: theme.palette.error.main,
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              } else if (result.isDismissed) {
                location.reload();
              }
            });
          }
        } else if (error.request) {
          if (!server) {
            this.props.history.push("/logout");
          } else {
            Swal.fire({
              title: "Error!",
              text: `libDrive could not communicate with the server! Is '${server}' the correct address?`,
              icon: "error",
              confirmButtonText: "Logout",
              confirmButtonColor: theme.palette.success.main,
              cancelButtonText: "Retry",
              cancelButtonColor: theme.palette.error.main,
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              } else if (result.isDismissed) {
                location.reload();
              }
            });
          }
        }
      });
  }

  componentWillUnmount() {
    seo();
  }

  render() {
    let { isLoaded, metadata, page, pages, sort } = this.state;

    if (isLoaded) {
      seo({
        title: `libDrive - ${metadata[0].categoryInfo.name}`,
        description: `Browse ${metadata[0].categoryInfo.name} on libDrive!`,
      });
    }

    return isLoaded ? (
      <div className="CategoryBrowse">
        <Nav {...this.props} />
        <Tile metadata={metadata} />
        <PageMenu
          state={{ page: page, pages: pages, sort: sort }}
          props={this.props}
        />
        <SortMenu state={{ sort: sort }} props={this.props} />
        <Footer />
      </div>
    ) : (
      <div className="Loading">
        <CircularProgress />
      </div>
    );
  }
}
