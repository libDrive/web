import React, { Component } from "react";

import { Link } from "react-router-dom";

import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { guid } from "../../components";

import "./index.css";

const styles = (theme) => ({
  formControl: {
    margin: "10px",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "20px",
  },
});

class SortMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="SortMenu">
        <div className="sort__container">
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="sort-menu-label">Sort</InputLabel>
            <Select
              labelId="sort-menu-label"
              id="sort-menu"
              value=""
              label="Sort"
            >
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=alphabet-asc`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Alphabet Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=alphabet-des`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Alphabet Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=date-asc`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Date Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=date-des`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Date Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=popularity-asc`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Popularity Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=popularity-des`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Popularity Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=vote-asc`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Vote Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=vote-des`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Vote Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=random`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Random</MenuItem>
              </Link>
            </Select>
          </FormControl>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SortMenu);
