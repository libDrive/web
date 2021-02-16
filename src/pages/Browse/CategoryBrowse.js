import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Button, Menu, MenuItem } from "@material-ui/core";

import ClipLoader from "react-spinners/ClipLoader";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";
import queryString from "query-string";

import { Footer, Gallery, Nav, PageMenu, uuid } from "../../components";
import "../../components/SortMenu.css";

export default class CategoryBrowse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      category: this.props.match.params.category,
      isLoaded: false,
      metadata: {},
      page: parseInt(queryString.parse(this.props.location.search).page) || 1,
      range: `${
        queryString.parse(this.props.location.search).page === undefined
          ? "0:16"
          : `${
              (parseInt(queryString.parse(this.props.location.search).page) -
                1) *
              16
            }:${
              parseInt(queryString.parse(this.props.location.search).page) * 16
            }`
      }`,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      sort:
        queryString.parse(this.props.location.search).sort || "alphabet-asc",
    };
  }

  async componentDidMount() {
    let { auth, category, range, server, sort } = this.state;
    let url = `${server}/api/v1/metadata?a=${auth}&c=${category}&r=${range}&s=${sort}`;

    axios
      .get(url)
      .then((response) =>
        this.setState({
          isLoaded: true,
          metadata: response.data,
          pages: Math.ceil(response.data[0]["length"] / 16),
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
              } else if (result.isDenied) {
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
  }

  render() {
    let { isLoaded, metadata, page, pages } = this.state;

    return isLoaded ? (
      <div className="CategoryBrowse">
        <Nav />
        <Gallery metadata={metadata} />
        <PageMenu props={{ page: page, pages: pages, thisprops: this.props }} />
        <SortMenu props={{ thisprops: this.props }} />
        <Footer />
      </div>
    ) : (
      <div className="Loading">
        <ClipLoader color="#4197fe" size={75} />
      </div>
    );
  }
}

export function SortMenu(props) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  let { thisprops } = props.props;

  return (
    <div className="SortMenu">
      <div className="sort__container">
        <Button
          aria-controls="sort-menu"
          aria-haspopup="true"
          onClick={handleClick}
          variant="outlined"
          color="primary"
        >
          Sort
        </Button>
        <Menu
          id="sort-menu"
          anchorEl={menuAnchorEl}
          keepMounted
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          open={Boolean(menuAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=alphabet-asc`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Alphabet Ascending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=alphabet-des`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Alphabet Descending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=date-asc`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Date Ascending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=date-des`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Date Descending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=popularity-asc`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Popularity Ascending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=popularity-des`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Popularity Descending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=vote-asc`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Vote Ascending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=vote-des`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Vote Descending
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?sort=random`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              Random
            </Link>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
