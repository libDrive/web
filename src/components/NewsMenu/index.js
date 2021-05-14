import React, { Component } from "react";

import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Typography,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { guid } from "../../components";

export default class NewsMenu extends Component {
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
    let { news } = this.props;

    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="news-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <NotificationsIcon />
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
