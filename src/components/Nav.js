import React, { Component, useState } from "react";

import { Link, useHistory } from "react-router-dom";

import {
  AppBar,
  Button,
  Divider,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Brightness6Icon from "@material-ui/icons/Brightness6";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

import { theme, guid } from "../components";

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
    let url = `${server}/api/v1/environment?a=${auth}`;

    axios.get(url).then((response) => {
      let data = response.data;
      this.setState({
        accounts: data.content.account_list,
        categories: data.content.category_list,
        isLoaded: true,
      });
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
      <div className="Nav">
        <NavUI
          props={{
            categories: [],
            accounts: [],
          }}
        />
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
          <ThemeMenu />
          <AccountMenu props={props.props.accounts} />
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

export function BrowseMenu(props) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const classes = styles();

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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <Link to={"/"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Home Page</MenuItem>
        </Link>
        <Divider light />
        {props.props.length
          ? props.props.map((category) => (
              <Link
                to={`/browse/${category.name}`}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem onClick={handleClose}>{category.name}</MenuItem>
              </Link>
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

  const handleRebuild = () => {
    let auth = sessionStorage.getItem("auth") || localStorage.getItem("auth");
    let server =
      sessionStorage.getItem("server") || localStorage.getItem("server");

    let url = `${server}/api/v1/rebuild?a=${auth}`;
    axios
      .get(url)
      .then((response) =>
        Swal.fire({
          title: "Success!",
          text: "libDrive's metadata is being rebuilt...",
          icon: "success",
          confirmButtonText: "OK",
        })
      )
      .catch((error) => {
        console.error(error);
        if (auth == null || server == null) {
          this.props.history.push("/login");
        } else if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              title: "Error!",
              text: "Your credentials are invalid!",
              icon: "error",
              confirmButtonText: "Logout",
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              }
            });
          } else {
            Swal.fire({
              title: "Error!",
              text:
                "Something went wrong while communicating with the backend!",
              icon: "error",
              confirmButtonText: "Logout",
              cancelButtonText: "Retry",
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              } else if (result.isDismissed) {
                location.reload();
              }
            });
          }
        } else if (error.request) {
          Swal.fire({
            title: "Error!",
            text: `libDrive could not communicate with the backend! Is ${server} the correct address?`,
            icon: "error",
            confirmButtonText: "Logout",
            cancelButtonText: "Retry",
            showCancelButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.props.history.push("/logout");
            } else if (result.isDismissed) {
              location.reload();
            }
          });
        }
      });
  };

  let pic = <AccountCircle />;
  if (
    props.props.pic &&
    (props.props.pic.includes("http") || props.props.pic.includes("www"))
  ) {
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <Link to={"/settings"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Link>
        <MenuItem onClick={handleRebuild}>Rebuild</MenuItem>
        <Link to={"/logout"} className="no_decoration_link">
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
}

export function ThemeMenu() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLight = () => {
    setMenuAnchorEl(null);
    localStorage.setItem("theme", "light");
    sessionStorage.setItem("theme", "light");
    window.location.reload();
  };

  const handleDark = () => {
    setMenuAnchorEl(null);
    localStorage.setItem("theme", "dark");
    sessionStorage.setItem("theme", "dark");
    window.location.reload();
  };

  const handleDracula = () => {
    setMenuAnchorEl(null);
    localStorage.setItem("theme", "dracula");
    sessionStorage.setItem("theme", "dracula");
    window.location.reload();
  };

  const handleNord = () => {
    setMenuAnchorEl(null);
    localStorage.setItem("theme", "nord");
    sessionStorage.setItem("theme", "nord");
    window.location.reload();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="theme-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Brightness6Icon />
      </IconButton>
      <Menu
        id="theme-menu"
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLight}>Light</MenuItem>
        <MenuItem onClick={handleDark}>Dark</MenuItem>
        <MenuItem onClick={handleDracula}>Dracula</MenuItem>
        <MenuItem onClick={handleNord}>Nord</MenuItem>
      </Menu>
    </div>
  );
}
