import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Button, Menu, MenuItem } from "@material-ui/core";
import TvIcon from "@material-ui/icons/Tv";

import { guid } from "../../components";

export default class ChildrenMenu extends Component {
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

  handleClose() {
    this.setState({
      menuAnchor: false,
    });
  }

  render() {
    let { metadata, menuAnchor } = this.state;
    return (
      <div className="info__button2">
        <Button
          variant="outlined"
          color="primary"
          style={{ width: "135px" }}
          aria-controls="children-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          startIcon={<TvIcon />}
        >
          Seasons
        </Button>
        <Menu
          id="children-menu"
          anchorEl={menuAnchor}
          keepMounted
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          open={Boolean(menuAnchor)}
          onClose={this.handleClose}
        >
          {metadata.children.length
            ? metadata.children.map((child) => {
                if (child.type == "directory") {
                  return (
                    <Link
                      to={`/view/ts/${child.id}`}
                      className="no_decoration_link"
                      key={guid()}
                    >
                      <MenuItem onClick={this.handleClose}>
                        {child.name}
                      </MenuItem>
                    </Link>
                  );
                }
              })
            : null}
        </Menu>
      </div>
    );
  }
}
