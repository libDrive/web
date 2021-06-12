import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";

import { version } from "../../components";

const styles = (theme) => ({
  footer__container: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "75px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

class Footer extends Component {
  render() {
    const { classes } = this.props;

    return (
      <footer className={classes.footer__container} id="footer__container">
        <a href="https://github.com/libDrive/libDrive" target="_blank">
          <img
            src="/images/github.gif"
            className="footer__github"
            height="64px"
            alt="github-logo"
          />
        </a>
        <a
          className="no_decoration_link footer__text"
          href="https://eliasbenb.cf"
          target="_blank"
        >
          {`© 2021 Copyright: Elias Benbourenane - v${version}`}
        </a>
      </footer>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Footer);
