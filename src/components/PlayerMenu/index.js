import React, { Component } from "react";

import { Button, Divider, Menu, MenuItem } from "@material-ui/core";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";

export default class PlayerMenu extends Component {
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
    let { auth, id, metadata, server } = this.state;

    return (
      <div className="PlayerMenu" style={{ margin: "5px" }}>
        <Button
          variant="outlined"
          color="primary"
          aria-controls="player-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          startIcon={<PlayCircleOutlineIcon />}
        >
          External Player
        </Button>
        <Menu
          id="player-menu"
          anchorEl={this.state.menuAnchor}
          keepMounted
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          open={Boolean(this.state.menuAnchor)}
          onClose={this.handleClose}
        >
          <a
            href={`vlc://${server}/api/v1/redirectdownload/${encodeURI(
              metadata.name
            )}?a=${auth}&id=${id}`}
            className="no_decoration_link"
          >
            <MenuItem onClick={this.handleClose}>VLC</MenuItem>
          </a>
          <a
            href={`potplayer://${server}/api/v1/redirectdownload/${encodeURI(
              metadata.name
            )}?a=${auth}&id=${id}`}
            className="no_decoration_link"
          >
            <MenuItem onClick={this.handleClose}>PotPlayer</MenuItem>
          </a>
          <a
            href={`nplayer-${server}/api/v1/redirectdownload/${encodeURI(
              metadata.name
            )}?a=${auth}&id=${id}`}
            className="no_decoration_link"
          >
            <MenuItem onClick={this.handleClose}>nPlayer</MenuItem>
          </a>
          <Divider />
          <MenuItem
            onClick={() => {
              navigator.clipboard.writeText(
                `${server}/api/v1/redirectdownload/${encodeURI(
                  metadata.name
                )}?a=${auth}&id=${id}`
              );
              this.handleClose();
            }}
          >
            Copy
          </MenuItem>
          <a
            href={`${server}/api/v1/redirectdownload/${encodeURI(
              metadata.name
            )}?a=${auth}&id=${id}`}
            className="no_decoration_link"
            target="_blank"
          >
            <MenuItem onClick={this.handleClose}>Download</MenuItem>
          </a>
        </Menu>
      </div>
    );
  }
}
