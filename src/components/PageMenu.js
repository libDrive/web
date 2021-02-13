import React from "react";

import { Link, Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

import { uuid } from "../components";

const styles = makeStyles((theme) => ({
  root: {
    "& > *": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: theme.spacing(4),
    },
  },
}));

export default function PageMenu(props) {
  let { page, pages, thisprops } = props.props;
  const classes = styles();

  if (page > pages) {
    return (
      <Redirect
        to={{
          pathname: thisprops.location.pathname,
          search: `?page=${pages}`,
        }}
      />
    );
  } else {
    return (
      <div className={classes.root}>
        <Pagination
          page={page}
          count={pages}
          variant="outlined"
          color="primary"
          renderItem={(item) => (
            <Link
              to={{
                pathname: thisprops.location.pathname,
                search: `?page=${item.page}`,
              }}
              key={uuid()}
              className="no_decoration_link"
            >
              <PaginationItem {...item} />
            </Link>
          )}
        />
      </div>
    );
  }
}
