import React, { Component } from "react";

import { Link } from "react-router-dom";

import {
  AppBar,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
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
    backgroundColor: theme.palette.background.paper,
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
    backgroundColor: fade(theme.palette.common.main, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.main, 0.25),
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
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
});

class NavUI extends Component {
  constructor(props) {
    super(props);
    this.state = { search: "", ...props.state };
    this.searchChange = this.searchChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
  }

  searchChange(evt) {
    this.setState({ search: evt.target.value });
  }

  searchSubmit(evt) {
    evt.preventDefault();
    this.props.history.push({
      pathname: `/search/${this.state.search}`,
      key: guid(),
    });
  }

  render() {
    let { accounts, categories, news } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.grow}>
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <Link to="/" className="no_decoration_link">
              <Typography className={classes.title} variant="h6" noWrap>
                libDrive
              </Typography>
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
              />
            </form>
            <div className={classes.grow} />
            <BrowseMenu categories={categories} />
            <ThemeMenu />
            <NewsMenu news={news} />
            <AccountMenu accounts={accounts} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NavUI);
