import React, { Component } from "react";

import { Button, Menu, MenuItem } from "@material-ui/core";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";

export default class DownloadMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: false,
      ...props.state,
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
    let { menuAnchor, sources } = this.state;

    return (
      <div className="DownloadMenu" style={{ marginTop: "20px" }}>
        <Button
          variant="outlined"
          color="primary"
          aria-controls="download-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          startIcon={<CloudDownloadOutlinedIcon />}
        >
          Download
        </Button>
        <Menu
          id="download-menu"
          anchorEl={menuAnchor}
          keepMounted
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          open={Boolean(menuAnchor)}
          onClose={this.handleClose}
        >
          {sources.length
            ? sources.map((source) => (
                <a
                  href={source.url}
                  className="no_decoration_link"
                  target="_blank"
                >
                  <MenuItem onClick={this.handleClose}>{source.name}</MenuItem>
                </a>
              ))
            : null}
        </Menu>
      </div>
    );
  }
}
