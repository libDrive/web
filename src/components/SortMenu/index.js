import React, { Component } from "react";

import { Link } from "react-router-dom";

import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { guid } from "../../components";

import "./index.css";

const styles = (theme) => ({
  formControl: {
    margin: "10px",
    minWidth: 210,
  },
  selectEmpty: {
    marginTop: "20px",
  },
});

class SortMenu extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
    this.formatSort = this.formatSort.bind(this);
  }

  formatSort(str) {
    if (!str) {
      return "Sort";
    }
    let str_split = str.split("-");
    for (var i = 0; i < str_split.length; i++) {
      if (str_split[i] == "asc") {
        str_split[i] = "ascending";
      } else if (str_split[i] == "des") {
        str_split[i] = "descending";
      }
      str_split[i] =
        str_split[i].charAt(0).toUpperCase() + str_split[i].substring(1);
    }
    return str_split.join(" ");
  }

  render() {
    let { genre, sort } = this.state;
    const { classes } = this.props;

    return (
      <div className="SortMenu">
        <div className="sort__container">
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="sort-menu-label">
              {this.formatSort(sort) || "Sort"}
            </InputLabel>
            <Select
              labelId="sort-menu-label"
              id="sort-menu"
              value=""
              label={this.formatSort(sort) || "Sort"}
            >
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=alphabet-asc&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Alphabet Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=alphabet-des&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Alphabet Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=date-asc&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Date Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=date-des&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Date Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=popularity-asc&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Popularity Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=popularity-des&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Popularity Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=vote-asc&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Vote Ascending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=vote-des&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Vote Descending</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=random&genre=${genre}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Random</MenuItem>
              </Link>
            </Select>
          </FormControl>
        </div>
        <div className="sort__container">
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="genre-menu-label">{genre || "Genre"}</InputLabel>
            <Select
              labelId="genre-menu-label"
              id="genre-menu"
              value=""
              label={genre || "Genre"}
            >
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Action`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Action</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Adventure`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Adventure</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Animation`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Animation</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Comedy`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Comedy</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Crime`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Crime</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Documentary`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Documentary</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Drama`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Drama</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Family`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Family</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Fantasy`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Fantasy</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=History`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>History</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Horror`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Horror</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Music`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Music</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Mystery`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Mystery</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Romance`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Romance</MenuItem>
              </Link>

              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Science Fiction`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Science Fiction</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=TV Movie`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>TV Movie</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Thriller`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Thriller</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=War`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>War</MenuItem>
              </Link>
              <Link
                to={{
                  pathname: this.props.props.location.pathname,
                  search: `?sort=${sort}&genre=Western`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <MenuItem>Western</MenuItem>
              </Link>
            </Select>
          </FormControl>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SortMenu);
