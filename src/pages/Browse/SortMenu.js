import React from "react";

import { Link } from "react-router-dom";

import { Button, Menu, MenuItem } from "@material-ui/core";

import { guid } from "../../components";

import "./SortMenu.css";

export default function SortMenu(props) {
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
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=alphabet-asc`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Alphabet Ascending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=alphabet-des`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Alphabet Descending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=date-asc`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Date Ascending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=date-des`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Date Descending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=popularity-asc`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Popularity Ascending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=popularity-des`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Popularity Descending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=vote-asc`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Vote Ascending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=vote-des`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Vote Descending</MenuItem>
          </Link>
          <Link
            to={{
              pathname: thisprops.location.pathname,
              search: `?sort=random`,
            }}
            key={guid()}
            className="no_decoration_link"
          >
            <MenuItem>Random</MenuItem>
          </Link>
        </Menu>
      </div>
    </div>
  );
}
