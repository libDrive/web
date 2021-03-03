import React from "react";

import { Link, Redirect } from "react-router-dom";

import { Pagination, PaginationItem } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

import { guid } from "../components";

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
  let { page, pages, sort, thisprops } = props.props;
  const classes = styles();

  if (page > pages) {
    return (
      <Redirect
        to={{
          pathname: thisprops.location.pathname,
          search: `?page=${pages}&sort=${sort}`,
        }}
        key={guid()}
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
          renderItem={(item) =>
            item.page ? (
              <Link
                to={{
                  pathname: thisprops.location.pathname,
                  search: `?page=${item.page}&sort=${sort}`,
                }}
                key={guid()}
                className="no_decoration_link"
              >
                <PaginationItem {...item} />
              </Link>
            ) : (
              <PaginationItem {...item} />
            )
          }
        />
      </div>
    );
  }
}
