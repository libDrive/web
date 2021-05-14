import React, { Component, useState } from "react";

import { Link, useHistory } from "react-router-dom";

import {
  AppBar,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

import axios from "axios";

import {
  AccountMenu,
  BrowseMenu,
  NewsMenu,
  ThemeMenu,
  guid,
} from "../../components";

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      categories: [],
      isLoaded: false,
      news: [],
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    let { auth, server } = this.state;

    await axios
      .get(`${server}/api/v1/environment?a=${auth}`)
      .then((response) => {
        let data = response.data;
        this.setState({
          accounts: data.content.account_list,
          categories: data.content.category_list,
          isLoaded: true,
        });
      });

    await axios
      .get("https://api.github.com/repos/libDrive/libDrive/releases")
      .then((response) => {
        let data = response.data;
        this.setState({
          news: data,
        });
      });
  };

  render() {
    let { accounts, categories, isLoaded, news } = this.state;

    return isLoaded ? (
      <div className="Nav">
        <NavUI categories={categories} accounts={accounts} news={news} />
      </div>
    ) : (
      <div className="Nav">
        <NavUI categories={[]} accounts={[]} news={[]} />
      </div>
    );
  }
}

const styles = makeStyles((theme) => ({
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
}));

export function NavUI(props) {
  const classes = styles();
  const history = useHistory();

  const [search, setSearch] = useState("");
  const searchChange = (evt) => {
    setSearch(evt.target.value);
  };

  const searchSubmit = (evt) => {
    evt.preventDefault();
    history.push({
      pathname: `/search/${search}`,
      key: guid(),
    });
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Link to="/" className="no_decoration_link">
            <Typography className={classes.title} variant="h6" noWrap>
              libDrive
            </Typography>
          </Link>
          <form className={classes.search} onSubmit={searchSubmit}>
            <IconButton onClick={searchSubmit} className={classes.searchIcon}>
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={searchChange}
            />
          </form>
          <div className={classes.grow} />
          <BrowseMenu categories={props.categories} />
          <ThemeMenu />
          <NewsMenu news={props.news} />
          <AccountMenu accounts={props.accounts} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export function LoadingNavUI() {
  const classes = styles();

  const [search, setSearch] = useState("");
  const searchChange = (evt) => {
    setSearch(evt.target.value);
  };

  const searchSubmit = (evt) => {
    evt.preventDefault();
    window.location.hash = `#/search/${search}`;
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Link to="/" className="no_decoration_link">
            <Typography className={classes.title} variant="h6" noWrap>
              libDrive
            </Typography>
          </Link>
          <form className={classes.search} onSubmit={searchSubmit}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={searchChange}
            />
          </form>
        </Toolbar>
      </AppBar>
    </div>
  );
}
