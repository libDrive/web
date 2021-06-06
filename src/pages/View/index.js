import React, { Component } from "react";

import { CircularProgress } from "@material-ui/core";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";
import queryString from "query-string";

import { Footer, Nav, theme } from "../../components";
import MovieView from "./MovieView";
import { TVBView, TVSView } from "./TVView";
import "./index.css";

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      q: parseInt(queryString.parse(this.props.location.search).q) || 0,
      id: this.props.match.params.id,
      isLoaded: false,
      metadata: {},
      sources: [],
      subtitle: { url: "" },
    };
  }

  componentDidMount() {
    let { auth, server } = this.state;

    if (!auth || !server) {
      this.props.history.push("/logout");
    }

    document.documentElement.style.setProperty(
      "--plyr-color-main",
      theme.palette.primary.main
    );
    document.documentElement.style.setProperty(
      "--plyr-video-background",
      theme.palette.background.default
    );
    document.documentElement.style.setProperty(
      "--plyr-menu-background",
      theme.palette.background.paper
    );
    document.documentElement.style.setProperty(
      "--plyr-menu-color",
      theme.palette.text.primary
    );

    this.fetchData();
  }

  fetchData = async () => {
    let { auth, id, name, q, server } = this.state;

    await axios
      .get(`${server}/api/v1/metadata?a=${auth}&id=${id}`)
      .then((response) => {
        let data = response.data;
        if (data.content.mimeType == "application/vnd.google-apps.folder") {
          id = data.content.children[q].id;
          name = data.content.children[q].name;
        } else {
          name = data.content.name;
        }
        this.setState({
          metadata: data.content,
        });
      })
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

    await axios
      .get(
        `${server}/api/v1/stream_map?a=${auth}&id=${id}&name=${name}&server=${server}`
      )
      .then((response) => {
        this.setState({
          sources: response.data.content.sources,
          subtitle: response.data.content.subtitle,
          isLoaded: true,
        });
      })
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
              text: `Something went wrong while communicating with the server! Is '${server}' the correct address?`,
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
  };

  render() {
    let { isLoaded, metadata } = this.state;

    return isLoaded && metadata.type == "file" ? (
      <div className="View">
        <Nav {...this.props} />
        <MovieView state={this.state} />
        <Footer />
      </div>
    ) : isLoaded && metadata.type == "directory" && metadata.title ? (
      <div className="View">
        <Nav {...this.props} />
        <TVBView state={this.state} />
        <Footer />
      </div>
    ) : isLoaded && metadata.type == "directory" ? (
      <div className="View">
        <Nav {...this.props} />
        <TVSView state={this.state} />
        <Footer />
      </div>
    ) : (
      <div className="Loading">
        <CircularProgress />
      </div>
    );
  }
}
