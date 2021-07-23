import React, { Component } from "react";

import { CircularProgress } from "@material-ui/core";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";
import queryString from "query-string";

import { Footer, Nav, seo, theme } from "../../components";
import MovieView from "./MovieView";
import { TVBView, TVSView } from "./TVView";
import "./index.css";

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") ||
        localStorage.getItem("server") ||
        window.location.origin,
      auth:
        sessionStorage.getItem("auth") || localStorage.getItem("auth") || "0",
      q: parseInt(queryString.parse(this.props.location.search).q) || 0,
      id: this.props.match.params.id,
      isAndroid: /(android)/i.test(
        navigator.userAgent || navigator.vendor || window.opera
      ),
      isIOS:
        /iPad|iPhone|iPod/.test(
          navigator.userAgent || navigator.vendor || window.opera
        ) && !window.MSStream,
      isLoaded: false,
      metadata: {},
      sources: [],
      subtitle: { url: "" },
      ui_config: JSON.parse(
        window.localStorage.getItem("ui_config") ||
          window.sessionStorage.getItem("ui_config") ||
          "{}"
      ),
    };
  }

  async componentDidMount() {
    let { auth, id, q, server } = this.state;

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

    const [response1] = await Promise.all([
      axios.get(`${server}/api/v1/metadata?a=${auth}&id=${id}`),
      axios.get(
        `${server}/api/v1/streammap?a=${auth}&id=${id}&name=test&server=${server}`
      ),
    ]).catch((error) => {
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

    let name;
    if (
      response1.data.content.mimeType == "application/vnd.google-apps.folder"
    ) {
      id = response1.data.content.children[q].id;
      name = response1.data.content.children[q].name;
    } else {
      name = response1.data.content.name;
    }

    const response2 = await axios
      .get(
        `${server}/api/v1/streammap?a=${auth}&id=${id}&name=${name}&server=${server}`
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
    this.setState({
      isLoaded: true,
      metadata: response1.data.content,
      name: name,
      sources: response2.data.content.sources,
      subtitle: response2.data.content.subtitle,
    });
  }

  componentWillUnmount() {
    seo();
  }

  render() {
    let { isLoaded, metadata, ui_config } = this.state;

    if (isLoaded) {
      seo({
        title: metadata.title
          ? `${ui_config.title || "libDrive"} - ${metadata.title}`
          : ui_config.title || "libDrive",
        description: `Watch ${metadata.title || metadata.name} on ${
          ui_config.title || "libDrive"
        }!`,
        image: metadata.backdropPath,
      });
    }

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
