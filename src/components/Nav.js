import React, { Component, useState } from "react";

import { useHistory } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";

import axios from "axios";

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      categories: {},
      isLoaded: false,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  componentDidMount() {
    let { auth, server } = this.state;

    axios
      .get(`${server}/api/v1/environment?a=${auth}`)
      .then((response) =>
        this.setState({
          accounts: response.data.account_list,
          categories: response.data.category_list,
          isLoaded: true,
        })
      )
      .catch((error) => {
        console.error(error);
        if (auth == null || server == null) {
          alert("You are not authenticated");
          this.props.history.push("/logout");
        } else if (error.response) {
          if (error.response.status === 401) {
            alert("Your credentials are invalid. Logging you out now.");
            this.props.history.push("/logout");
          } else {
            alert("Something went wrong while communicating with the backend");
          }
        } else if (error.request) {
          alert(
            `libDrive could not communicate with the backend. Is ${server} the correct address?`
          );
        }
      });
  }

  render() {
    let { accounts, categories, isLoaded } = this.state;

    return isLoaded ? (
      <div className="Nav">
        <NavUI
          props={{
            categories: categories,
            accounts: accounts,
          }}
        />
      </div>
    ) : (
      <div className="Nav"></div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#1f1f1f",
    color: "#ffffff",
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
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
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
    pointerEvents: "none",
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
  browse: {
    marginRight: "15px",
  },
}));

export function NavUI(props) {
  const classes = useStyles();
  let history = useHistory();

  const [search, setSearch] = useState("");
  const searchChange = (evt) => {
    setSearch(evt.target.value);
  };
  const searchSubmit = (evt) => {
    evt.preventDefault();
    history.push(`/search/${search}`);
    history.go();
  };
  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <a href="/" className="no_decoration_link">
            <Typography className={classes.title} variant="h6" noWrap>
              libDrive
            </Typography>
          </a>
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
          <div className={classes.grow} />
          <BrowseMenu props={props.props.categories} />
          <AccountMenu props={props.props.accounts} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export function BrowseMenu(props) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div className={classes.browse}>
      <Button
        aria-controls="browse-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Browse
      </Button>
      <Menu
        id="browse-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        {props.props.length
          ? props.props.map((category) => (
              <a
                href={`/browse/${category.name}`}
                className="no_decoration_link"
              >
                <MenuItem onClick={handleClose}>{category.name}</MenuItem>
              </a>
            ))
          : null}
      </Menu>
    </div>
  );
}

export function AccountMenu(props) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  let pic = <AccountCircle />;
  if (props.props.pic.includes("http") || props.props.pic.includes("www")) {
    pic = <img src={props.props.pic} width="32px" alt="profile-pic"></img>;
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="account-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {pic}
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <a href={"/settings"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </a>
        <a href={"/logout"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </a>
      </Menu>
    </div>
  );
}
