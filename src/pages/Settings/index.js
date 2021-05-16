import React, { Component } from "react";

import { Button, CircularProgress, Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import ReactJson from "react-json-view";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

import { Footer, Nav, theme } from "../../components";

const styles = (theme) => ({
  Form: {
    textAlign: "center",
    "& .MuiTextField-root": {
      width: "30ch",
      margin: theme.spacing(1),
      textAlign: "left",
    },
    "& .MuiTypography-root": {
      margin: "30px 30px",
    },
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
    width: "20ch",
  },
});

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      error: "",
      isLoaded: false,
      secret: sessionStorage.getItem("secret"),
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };

    this.dismissError = this.dismissError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleKillSwitch = this.handleKillSwitch.bind(this);
  }

  componentDidMount() {
    let { secret, server } = this.state;

    if (sessionStorage.getItem("secret") == null) {
      this.props.history.push("/settings/login");
    } else {
      axios
        .get(`${server}/api/v1/config?secret=${secret}`)
        .then((response) =>
          this.setState({
            config: response.data.content,
            isLoaded: true,
            config: response.data.content,
            tempSecret: response.data.content.secret_key,
          })
        )
        .catch((error) => {
          console.error(error);
          if (error.response) {
            let data = error.response.data;
            if (data.code === 401) {
              Swal.fire({
                title: "Error!",
                text: data.message,
                icon: "error",
                confirmButtonText: "Login",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.props.history.push("/logout");
                }
              });
            } else if (!server) {
              this.props.history.push("/logout");
            } else {
              Swal.fire({
                title: "Error!",
                text: data.message,
                icon: "error",
                confirmButtonText: "Logout",
                cancelButtonText: "Retry",
                showCancelButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  this.props.history.push("/logout");
                } else if (result.isDismissed) {
                  location.reload();
                }
              });
            }
          } else if (error.request) {
            if (!server) {
              this.props.history.push("/logout");
            } else {
              Swal.fire({
                title: "Error!",
                text: `libDrive could not communicate with the server! Is '${server}' the correct address?`,
                icon: "error",
                confirmButtonText: "Logout",
                cancelButtonText: "Retry",
                showCancelButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  this.props.history.push("/logout");
                } else if (result.isDismissed) {
                  location.reload();
                }
              });
            }
          }
        });
    }
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleRestart(evt) {
    evt.preventDefault();
    let { secret, server } = this.state;

    axios
      .get(`${server}/api/v1/restart?secret=${secret}`)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Success!",
          text: "libDrive is being restarted, this might take some time, so the app won't load",
          icon: "success",
          confirmButtonText: "OK",
        });
      });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let { secret, server } = this.state;

    axios
      .post(`${server}/api/v1/config?secret=${secret}`, this.state.config)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          let data = error.response.data;
          if (data.code === 401) {
            Swal.fire({
              title: "Error!",
              text: data.message,
              icon: "error",
              confirmButtonText: "Logout",
            }).then((result) => {
              if (result.isConfirmed) {
                sessionStorage.removeItem("secret");
                this.props.history.push("/settings/login");
              }
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: data.message,
              icon: "error",
              confirmButtonText: "Logout",
              cancelButtonText: "Retry",
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              } else if (result.isDismissed) {
                location.reload();
              }
            });
          }
        } else if (error.request) {
          Swal.fire({
            title: "Error!",
            text: `libDrive could not communicate with the server! Is ${server} the correct address?`,
            icon: "error",
            confirmButtonText: "Logout",
            cancelButtonText: "Retry",
            showCancelButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.props.history.push("/logout");
            } else if (result.isDismissed) {
              location.reload();
            }
          });
        }
      });
  }

  handleChange(evt) {
    if (evt.existing_src !== evt.updated_src) {
      this.setState({
        config: evt.updated_src,
      });
    }
  }

  handleKillSwitch(evt) {
    let { config } = this.state;
    config.kill_switch = evt.target.checked;
    this.setState({ config: config });
    this.handleSubmit(evt);
  }

  render() {
    let { config, isLoaded } = this.state;
    const { classes } = this.props;

    return isLoaded ? (
      <div className="Settings">
        <Nav {...this.props} />
        <div
          style={{
            margin: "auto",
            marginTop: "50px",
            width: "80vw",
            maxWidth: "1500px",
          }}
        >
          <ReactJson
            src={config}
            name="config"
            onEdit={this.handleChange}
            onAdd={this.handleChange}
            onDelete={this.handleChange}
            collapseStringsAfterLength={
              Math.floor((window.innerWidth * 0.125) / 2) - 3
            }
            sortKeys={true}
            theme={{
              base00: theme.palette.background.paper,
              base01: theme.palette.background.default,
              base02: theme.palette.error.main,
              base03: theme.palette.text.primary,
              base04: theme.palette.text.primary,
              base05: theme.palette.text.primary,
              base06: theme.palette.text.primary,
              base07: theme.palette.text.primary,
              base08: theme.palette.text.primary,
              base09: theme.palette.secondary.main,
              base0A: theme.palette.secondary.main,
              base0B: theme.palette.secondary.main,
              base0C: theme.palette.secondary.main,
              base0D: theme.palette.secondary.main,
              base0E: theme.palette.secondary.main,
              base0F: theme.palette.secondary.main,
            }}
          />
        </div>
        <form
          className={classes.Form}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <div style={{ margin: "30px" }}>
            <Button
              style={{ margin: "10px" }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit Config
            </Button>
            <br />
            <Button
              style={{ margin: "10px" }}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleRestart}
            >
              Restart Server
            </Button>
            <br />
            <p
              style={{
                fontSize: "16px",
                marginTop: "10px",
                marginBotoom: "5px",
              }}
            >
              Kill Switch
            </p>
            <Switch
              checked={this.state.config.kill_switch}
              onChange={this.handleKillSwitch}
              color="primary"
              name="checkedB"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </div>
        </form>
        <Footer />
      </div>
    ) : (
      <div className="Loading">
        <CircularProgress />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Settings);
