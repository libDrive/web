import React, { Component } from "react";

import { Link } from "react-router-dom";

import {
  AppBar,
  Avatar,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";

import {
  AccountMenu,
  BrowseMenu,
  NewsMenu,
  ThemeMenu,
  guid,
} from "../../components";

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.main, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.main, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "15vw",
    maxWidth: "500px",
  },
});

class NavUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.state,
      ui_config: JSON.parse(
        window.localStorage.getItem("ui_config") ||
          window.sessionStorage.getItem("ui_config") ||
          "{}"
      ),
    };
    this.searchChange = this.searchChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  searchChange(evt) {
    this.setState({ search: evt.target.value });
  }

  searchSubmit(evt) {
    evt.preventDefault();
    if (!(this.state.search == "" || this.state.search == null)) {
      this.props.history.push({
        pathname: `/search/${this.state.search}`,
        key: guid(),
      });
    }
  }

  onMouseOver(evt) {
    evt.target.style.width = "20vw";
  }

  onMouseOut(evt) {
    evt.target.style.width = "15vw";
  }

  render() {
    let { accounts, categories, query, search, ui_config } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.grow}>
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <Link to="/" className="no_decoration_link">
              {ui_config.icon_on_nav ? (
                <Avatar alt="logo" src={ui_config.icon}>
                  L
                </Avatar>
              ) : (
                <Typography className={classes.title} variant="h6" noWrap>
                  {ui_config.title || "libDrive"}
                </Typography>
              )}
            </Link>
            <form className={classes.search} onSubmit={this.searchSubmit}>
              <IconButton
                onClick={this.searchSubmit}
                className={classes.searchIcon}
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={this.searchChange}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                value={search == null ? query : search}
              />
            </form>
            <div className={classes.grow} />
            <BrowseMenu categories={categories} />
            <ThemeMenu ui_config={ui_config} />
            {!ui_config.hide_news ? <NewsMenu /> : null}
            <AccountMenu accounts={accounts} ui_config={ui_config} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NavUI);
