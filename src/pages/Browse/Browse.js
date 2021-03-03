import React, { Component } from "react";

import ClipLoader from "react-spinners/ClipLoader";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

import { Carousel, Footer, Tile, Nav, theme } from "../../components";

export default class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: {},
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  componentDidMount() {
    let { auth, server } = this.state;
    let url = `${server}/api/v1/metadata?a=${auth}&r=0:16&s=popularity-des`;

    axios
      .get(url)
      .then((response) =>
        this.setState({
          isLoaded: true,
          metadata: response.data,
        })
      )
      .catch((error) => {
        console.error(error);
        if (auth == null || server == null) {
          this.props.history.push("/login");
        } else if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              title: "Error!",
              text: "Your credentials are invalid!",
              icon: "error",
              confirmButtonText: "Logout",
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              }
            });
          } else {
            Swal.fire({
              title: "Error!",
              text:
                "Something went wrong while communicating with the backend!",
              icon: "error",
              confirmButtonText: "Logout",
              cancelButtonText: "Retry",
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
          Swal.fire({
            title: "Error!",
            text: `libDrive could not communicate with the backend! Is ${server} the correct address?`,
            icon: "error",
            confirmButtonText: "Logout",
            cancelButtonText: "Retry",
            showCancelButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.props.history.push("/logout");
            } else if (result.isDismissed) {
              location.reload();
            }
          });
        }
      });
  }

  render() {
    let { isLoaded, metadata } = this.state;

    let gallery;
    if (
      sessionStorage.getItem("gallery") == "tile" ||
      localStorage.getItem("gallery") == "tile"
    ) {
      gallery = true;
    } else if (
      sessionStorage.getItem("gallery") == "carousel" ||
      localStorage.getItem("gallery") == "carousel"
    ) {
      gallery = false;
    } else {
      sessionStorage.setItem("gallery", "carousel");
      localStorage.setItem("gallery", "carousel");
      gallery = false;
    }

    return isLoaded ? (
      <div className="Browse">
        <Nav />
        {gallery ? (
          <Tile metadata={metadata} />
        ) : (
          <Carousel metadata={metadata} />
        )}
        <Footer />
      </div>
    ) : (
      <div className="Loading">
        <ClipLoader color={theme.palette.primary.main} size={75} />
      </div>
    );
  }
}
