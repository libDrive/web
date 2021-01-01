import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import axios from "axios";

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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: "",
      error: "",
      password: "",
      server: "",
      tempServer: "http://localhost:31145",
      username: "",
    };

    this.handleTempServerChange = this.handleTempServerChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let { auth, password, server, tempServer, username } = this.state;
    if (!tempServer) {
      return this.setState({ error: "Server is required" });
    }
    if (!username) {
      return this.setState({ error: "Username is required" });
    }
    if (!password) {
      return this.setState({ error: "Password is required" });
    }
    axios
      .get(`${tempServer}/api/v1/auth?u=${username}&p=${password}`)
      .then((response) =>
        this.setState({
          auth: response.data.auth,
          server: tempServer,
        })
      )
      .then(() => {
        if (auth && server) {
          localStorage.setItem("server", server);
          sessionStorage.setItem("server", server);
          localStorage.setItem("auth", auth);
          sessionStorage.setItem("auth", auth);
          this.props.history.push("/");
        }
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

  handleTempServerChange(evt) {
    this.setState({
      tempServer: evt.target.value,
    });
  }

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  }

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  render() {
    let { error, password, tempServer, username } = this.state;
    const { classes } = this.props;

    return (
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
              id="server"
              label="Server"
              name="server"
              autoComplete="server"
              onChange={this.handleTempServerChange}
              value={tempServer}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              onChange={this.handleUserChange}
              value={username}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handlePassChange}
              value={password}
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
    );
  }
}

export default withStyles(styles, { withTheme: true })(Login);
