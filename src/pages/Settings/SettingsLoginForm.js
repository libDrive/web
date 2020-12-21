import React, { Component } from "react";

import { withRouter } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import axios from "axios";

import { Nav } from "../../components";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SettingsLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      error: "",
      secret: "",
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };

    this.handleSecretChange = this.handleSecretChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let { auth, secret, server } = this.state;

    if (!secret) {
      return this.setState({ error: "Secret is required" });
    }

    axios
      .get(`${server}/api/v1/config?secret=${secret}`)
      .then((response) => {
        sessionStorage.setItem("secret", secret);
        this.props.history.push("/settings");
      })
      .catch((error) => {
        console.error(error);
        if (auth == null || server == null) {
          alert("You are not authenticated");
          this.props.history.push("/logout");
        } else if (error.response) {
          if (error.response.status === 401) {
            alert("Your credentials are invalid. Logging you out now.");
            this.props.history.push("/logout");
          } else {
            alert("Something went wrong while communicating with the backend");
          }
        } else if (error.request) {
          alert(
            `libDrive could not communicate with the backend. Is ${server} the correct address?`
          );
        }
      });
    return this.setState({ error: "" });
  }

  handleSecretChange(evt) {
    this.setState({
      secret: evt.target.value,
    });
  }

  render() {
    let { error, secret } = this.state;
    const { classes } = this.props;

    return (
      <div className="SettingsLoginForm">
        <Nav />
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form
              className={classes.form}
              onSubmit={this.handleSubmit}
              noValidate
            >
              {error && (
                <div style={{}}>
                  <h3 data-test="error" onClick={this.dismissError}>
                    <button onClick={this.dismissError}>✖</button>
                    {error}
                  </h3>
                </div>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="secret"
                label="Secret"
                name="secret"
                type="password"
                autoComplete="secret"
                onChange={this.handleSecretChange}
                value={secret}
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                block
              >
                Sign In
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(SettingsLoginForm)
);
