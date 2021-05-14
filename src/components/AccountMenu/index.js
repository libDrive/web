import React, { Component } from "react";

import { Link } from "react-router-dom";

import { IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

export default class BrowseMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRebuild = this.handleRebuild.bind(this);
  }

  handleClick(evt) {
    this.setState({
      menuAnchor: evt.currentTarget,
    });
  }

  handleClose(evt) {
    this.setState({
      menuAnchor: false,
    });
  }

  handleRebuild(evt) {
    let auth = sessionStorage.getItem("auth") || localStorage.getItem("auth");
    let server =
      sessionStorage.getItem("server") || localStorage.getItem("server");

    let url = `${server}/api/v1/rebuild?a=${auth}`;
    axios
      .get(url)
      .then((response) =>
        Swal.fire({
          title: "Success!",
          text: "libDrive's metadata is being rebuilt...",
          icon: "success",
          confirmButtonText: "OK",
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
              text: "Something went wrong while communicating with the server!",
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
            text: `libDrive could not communicate with the server! Is ${server} the correct address?`,
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
    let { accounts } = this.props;

    let pic = <AccountCircle />;
    if (
      accounts &&
      accounts.pic &&
      (accounts.pic.includes("http") || accounts.pic.includes("www"))
    ) {
      pic = <img src={accounts.pic} width="32px" alt="profile-pic"></img>;
    }

    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="account-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {pic}
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={this.state.menuAnchor}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          keepMounted
          open={Boolean(this.state.menuAnchor)}
          onClose={this.handleClose}
        >
          <Link to={"/settings"} className="no_decoration_link">
            <MenuItem onClick={this.handleClose}>Settings</MenuItem>
          </Link>
          <MenuItem onClick={this.handleRebuild}>Rebuild</MenuItem>
          <Link to={"/logout"} className="no_decoration_link">
            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
          </Link>
        </Menu>
      </div>
    );
  }
}
