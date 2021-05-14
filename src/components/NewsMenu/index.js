import React, { Component } from "react";

import {
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Typography,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { guid, version } from "../../components";

export default class NewsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invisibility: true,
      menuAnchor: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.compareVersions = this.compareVersions.bind(this);
  }

  componentDidMount() {
    let { news } = this.props;
    if (news.length) {
      this.setState({invisibility: this.compareVersions(version.replace("v", ""), news[0].tag_name.replace("v", ""))})
    }
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

  compareVersions(a, b) {
    var i, cmp, len;
    a = (a + "").split(".");
    b = (b + "").split(".");
    len = Math.max(a.length, b.length);
    for (i = 0; i < len; i++) {
      if (a[i] === undefined) {
        a[i] = "0";
      }
      if (b[i] === undefined) {
        b[i] = "0";
      }
      cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
      if (cmp !== 0) {
        return cmp < 0 ? false : true;
      }
    }
    return true;
  }

  render() {
    let { news } = this.props;

    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="news-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Badge color="secondary" variant="dot" invisible={this.state.invisibility}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          id="news-menu"
          anchorEl={this.state.menuAnchor}
          keepMounted
          open={Boolean(this.state.menuAnchor)}
          onClose={this.handleClose}
        >
          <List style={{ maxWidth: "500px" }}>
            {news.length
              ? news.slice(0, 3).map((item) => (
                  <ListItem key={guid()} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <strong>libDrive {item.tag_name} released!</strong>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="textPrimary">
                            libDrive {item.tag_name} was released on{" "}
                            {new Date(item.published_at).toDateString()}, click{" "}
                            <a
                              href={item.html_url}
                              target="_blank"
                              className="no_decoration_link"
                            >
                              <u>here</u>
                            </a>{" "}
                            to find out more
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))
              : null}
          </List>
        </Menu>
      </div>
    );
  }
}
