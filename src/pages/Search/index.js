import React, { Component } from "react";

import { CircularProgress } from "@material-ui/core";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

import { Carousel, Footer, Nav, theme } from "../../components";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth") || "0",
      isLoaded: false,
      metadata: [],
      query: this.props.match.params.q,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server") || window.location.origin,
    };
  }

  componentDidMount() {
    let { auth, query, server } = this.state;

    if (!auth || !server) {
      this.props.history.push("/logout");
    }

    let url = `${server}/api/v1/metadata?a=${auth}&q=${query}`;
    axios
      .get(url)
      .then((response) =>
        this.setState({
          isLoaded: true,
          metadata: response.data.content,
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

  render() {
    let { isLoaded, metadata } = this.state;

    return isLoaded ? (
      <div className="Search">
        <Nav {...this.props} />
        <Carousel metadata={metadata} />
        <Footer />
      </div>
    ) : (
      <div className="Loading">
        <CircularProgress />
      </div>
    );
  }
}
