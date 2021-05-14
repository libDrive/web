import React, { Component } from "react";

import { IconButton, Menu, MenuItem } from "@material-ui/core";
import Brightness6Icon from "@material-ui/icons/Brightness6";

export default class ThemeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTheme = this.handleTheme.bind(this);
  }

  handleClick(evt) {
    this.setState({
      menuAnchor: evt.currentTarget,
    });
  }

  handleClose(evt) {
    this.setState({
      menuAnchor: null,
    });
  }

  handleTheme(name) {
    this.setState({
      menuAnchor: null,
    });
    localStorage.setItem("theme", name);
    sessionStorage.setItem("theme", name);
    window.location.reload();
  }

  render() {
    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="theme-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Brightness6Icon />
        </IconButton>
        <Menu
          id="theme-menu"
          anchorEl={this.state.menuAnchor}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          keepMounted
          open={Boolean(this.state.menuAnchor)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={() => this.handleTheme("light")}>Light</MenuItem>
          <MenuItem onClick={() => this.handleTheme("dark")}>Dark</MenuItem>
          <MenuItem onClick={() => this.handleTheme("dracula")}>
            Dracula
          </MenuItem>
          <MenuItem onClick={() => this.handleTheme("nord")}>Nord</MenuItem>
        </Menu>
      </div>
    );
  }
}
