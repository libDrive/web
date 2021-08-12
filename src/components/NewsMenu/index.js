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

import axios from "axios";

import { guid, version } from "../../components";

export default class NewsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissed:
        (window.localStorage.getItem("dismissed") || "false") == "true",
      isLoaded: false,
      isNew: false,
      lastChecked: new Date(
        window.localStorage.getItem("last_news_check") || "0"
      ).getTime(),
      menuAnchor: false,
      news: JSON.parse(window.localStorage.getItem("news") || "[]"),
      now: new Date().getTime(),
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    let { isNew, lastChecked, news, now } = this.state;
    let targetTime = lastChecked + 3 * 60 * 60 * 1000;

    if (news.length && news[0].tag_name) {
      if (version != news[0].tag_name.replace("v", "")) {
        isNew = true;
      }
    }

    if (now >= targetTime) {
      axios
        .get("https://api.github.com/repos/libDrive/libDrive/releases")
        .then((response) => {
          let data = response.data;
          window.localStorage.setItem("news", JSON.stringify(data));
          window.localStorage.setItem("last_news_check", now);
          this.setState({
            isLoaded: true,
            isNew: isNew,
            news: data,
          });
        });
    } else {
      this.setState({ isLoaded: true, isNew: isNew });
    }
  }

  handleClick() {
    let { now } = this.state;

    axios
      .get("https://api.github.com/repos/libDrive/libDrive/releases")
      .then((response) => {
        let data = response.data;
        window.localStorage.setItem("news", JSON.stringify(data));
        window.localStorage.setItem("last_news_check", now);
        window.localStorage.setItem("dismissed", "true");
        this.setState({
          dismissed: true,
          news: data,
          menuAnchor: true,
        });
      });
  }

  handleClose() {
    this.setState({
      menuAnchor: false,
    });
  }

  render() {
    let { dismissed, isNew, isLoaded, menuAnchor, news } = this.state;

    return isLoaded ? (
      <div className="NewsMenu">
        <IconButton
          aria-label="more"
          aria-controls="news-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {!dismissed && isNew ? (
            <Badge badgeContent={"N"} color="primary">
              <NotificationsIcon />
            </Badge>
          ) : (
            <NotificationsIcon />
          )}
        </IconButton>
        <Menu
          id="news-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={this.handleClose}
        >
          <List style={{ maxWidth: "500px" }}>
            {news.length
              ? news.slice(0, 3).map((item) => (
                  <ListItem pri="true" key={guid()} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <strong>libDrive {item.tag_name} released!</strong>
                      }
                      secondary={
                        <React.Fragment>
                          <span>
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
                          </span>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))
              : null}
          </List>
        </Menu>
      </div>
    ) : null;
  }
}
