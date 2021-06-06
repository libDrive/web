import React, { Component } from "react";

import { Link } from "react-router-dom";

import { IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

import "@sweetalert2/theme-dark/dark.css";

export default class BrowseMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
          <Link to={"/logout"} className="no_decoration_link">
            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
          </Link>
        </Menu>
      </div>
    );
  }
}
