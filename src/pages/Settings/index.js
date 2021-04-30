import React, { Component } from "react";

import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import ClipLoader from "react-spinners/ClipLoader";

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
    this.handleRestart = this.handleRestart.bind(this);
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
            postConfig: response.data.content,
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
          text:
            "libDrive is being restarted, this might take some time, so the app won't load",
          icon: "success",
          confirmButtonText: "OK",
        });
      });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let { secret, server } = this.state;

    axios
      .post(`${server}/api/v1/config?secret=${secret}`, this.state.postConfig)
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

  render() {
    let { config, isLoaded } = this.state;
    const { classes } = this.props;

    return isLoaded ? (
      <div className="Settings">
        <Nav />
        <div style={{ margin: "auto", marginTop: "50px", width: "50%" }}>
          <JSONInput
            id="config-box"
            placeholder={config}
            locale={locale}
            height="500px"
            width="100%"
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
              style={{ marginRight: "20px" }}
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              target="_blank"
              href="https://libdrive-config.netlify.app/"
            >
              Create Config
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={this.handleRestart}
            >
              Restart
            </Button>
          </div>
        </form>
        <Footer />
      </div>
    ) : (
      <div className="Loading">
        <ClipLoader color={theme.palette.primary.main} size={75} />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Settings);
