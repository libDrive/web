import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";

import { version } from "../../components";

const styles = (theme) => ({
  container1: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "75px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

class Bottom extends Component {
  render() {
    const { classes } = this.props;

    return (
      <footer className={classes.container1} id={atob("Zm9vdGVyX19jb250YWluZXI=")}>
        <a
          href={atob("aHR0cHM6Ly9naXRodWIuY29tL2xpYkRyaXZlL2xpYkRyaXZl")}
          target="_blank"
        >
          <img
            src="/images/github.gif"
            className={atob("Zm9vdGVyX19naXRodWI=")}
            height="64px"
            alt="github-logo"
          />
        </a>
        <a
          className={atob("bm9fZGVjb3JhdGlvbl9saW5rIGZvb3Rlcl9fdGV4dA==")}
          href={atob("aHR0cHM6Ly9lbGlhc2JlbmIuY2Y=")}
          target="_blank"
        >
          {`${decodeURIComponent(
            escape(
              window.atob(
                "wqkgMjAyMSBDb3B5cmlnaHQ6IEVsaWFzIEJlbmJvdXJlbmFuZQ=="
              )
            )
          )} - v${version}`}
        </a>
      </footer>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Bottom);
