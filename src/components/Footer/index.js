import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { version } from "../../components";

import "./index.css";

const styles = makeStyles((theme) => ({
  footer__container: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "75px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function Footer() {
  const classes = styles();

  return (
    <footer className={classes.footer__container} id="footer__container">
      <a href="https://github.com/libDrive/libDrive" target="_blank">
        <img
          src="/images/github.png"
          className="footer__github"
          height="48px"
          alt="github-logo"
        />
      </a>
      <a
        className="no_decoration_link footer__text"
        href="https://eliasbenb.github.io"
        target="_blank"
      >
        {`© 2021 Copyright: Elias Benbourenane - v${version}`}
      </a>
    </footer>
  );
}
