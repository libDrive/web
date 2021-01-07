import React, { Component } from "react";

import AccountCircle from "@material-ui/icons/AccountCircle";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import RemoveIcon from "@material-ui/icons/Remove";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

import ClipLoader from "react-spinners/ClipLoader";

import Swal from "sweetalert2";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

import { Footer, Nav, uuid } from "../../components";

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

    this.handleAccessTokenChange = this.handleAccessTokenChange.bind(this);
    this.handleClientIDChange = this.handleClientIDChange.bind(this);
    this.handleClientSecretChange = this.handleClientSecretChange.bind(this);
    this.handleRefreshTokenChange = this.handleRefreshTokenChange.bind(this);
    this.handleCategoryTypeChange = this.handleCategoryTypeChange.bind(this);
    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
    this.handleCategoryIdChange = this.handleCategoryIdChange.bind(this);
    this.handleCategoryDriveIdChange = this.handleCategoryDriveIdChange.bind(
      this
    );
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
    this.handleAccountUsernameChange = this.handleAccountUsernameChange.bind(
      this
    );
    this.handleAccountPasswordChange = this.handleAccountPasswordChange.bind(
      this
    );
    this.handleAccountPicChange = this.handleAccountPicChange.bind(this);
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.handleRemoveAccount = this.handleRemoveAccount.bind(this);
    this.handleSecretChange = this.handleSecretChange.bind(this);
    this.handleTMDBAPIKeyChange = this.handleTMDBAPIKeyChange.bind(this);
    this.dismissError = this.dismissError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  async componentDidMount() {
    let { auth, secret, server } = this.state;

    axios
      .get(`${server}/api/v1/config?secret=${secret}`)
      .then((response) =>
        this.setState({
          config: response.data,
          isLoaded: true,
          postConfig: response.data,
          tempSecret: response.data.secret_key,
        })
      )
      .catch((error) => {
        console.error(error);
        if (auth == null || server == null) {
          this.props.history.push("/login");
        } else if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              title: "Error!",
              text: "Your credentials are invalid!",
              icon: "error",
              confirmButtonText: "Login",
            }).then((result) => {
              if (result.isConfirmed) {
                sessionStorage.removeItem("secret");
                this.props.history.push("/settings/login");
              }
            });
          } else {
            Swal.fire({
              title: "Error!",
              text:
                "Something went wrong while communicating with the backend!",
              icon: "error",
              confirmButtonText: "Logout",
              cancelButtonText: "Retry",
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              } else if (result.isDenied) {
                location.reload();
              }
            });
          }
        } else if (error.request) {
          Swal.fire({
            title: "Error!",
            text: `libDrive could not communicate with the backend! Is ${server} the correct address?`,
            icon: "error",
            confirmButtonText: "Logout",
            cancelButtonText: "Retry",
            showCancelButton: true,
          }).then((result) => {
            console.log(result);
            if (result.isConfirmed) {
              this.props.history.push("/logout");
            } else if (result.isDismissed) {
              location.reload();
            }
          });
        }
      });
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
          text:
            "libDrive is being restarted, this might take some time, so the app won't load",
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
          text:
            "The config has been updated on the backend! The backend might need to be restarted for some changes to take effect.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              title: "Error!",
              text: "Your credentials are invalid!",
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
              text:
                "Something went wrong while communicating with the backend!",
              icon: "error",
              confirmButtonText: "Logout",
              cancelButtonText: "Retry",
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              } else if (result.isDenied) {
                location.reload();
              }
            });
          }
        } else if (error.request) {
          Swal.fire({
            title: "Error!",
            text: `libDrive could not communicate with the backend! Is ${server} the correct address?`,
            icon: "error",
            confirmButtonText: "Logout",
            cancelButtonText: "Retry",
            showCancelButton: true,
          }).then((result) => {
            console.log(result);
            if (result.isConfirmed) {
              this.props.history.push("/logout");
            } else if (result.isDismissed) {
              location.reload();
            }
          });
        }
      });
  }

  handleAccessTokenChange(evt) {
    var value = evt.target.value;

    var configCopy = this.state.postConfig;
    configCopy.access_token = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleClientIDChange(evt) {
    var value = evt.target.value;

    var configCopy = this.state.postConfig;
    configCopy.client_id = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleClientSecretChange(evt) {
    var value = evt.target.value;

    var configCopy = this.state.postConfig;
    configCopy.client_secret = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleRefreshTokenChange(evt) {
    var value = evt.target.value;

    var configCopy = this.state.postConfig;
    configCopy.refresh_token = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleCategoryTypeChange(evt) {
    var value = evt.target.value.split("_")[0];
    var n = evt.target.value.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.category_list[n].type = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleCategoryNameChange(evt) {
    var value = evt.target.value;
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.category_list[n].name = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleCategoryIdChange(evt) {
    var value = evt.target.value;
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.category_list[n].id = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleCategoryDriveIdChange(evt) {
    var value = evt.target.value;
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.category_list[n].driveId = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleAddCategory(evt) {
    var configCopy = this.state.postConfig;
    configCopy.category_list.push({ type: "", name: "", id: "", driveId: "" });

    this.setState({
      postConfig: configCopy,
    });
  }

  handleRemoveCategory(evt) {
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.category_list.splice(n, 1);

    this.setState({
      postConfig: configCopy,
    });
  }

  handleAccountUsernameChange(evt) {
    var value = evt.target.value;
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.account_list[n].username = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleAccountPasswordChange(evt) {
    var value = evt.target.value;
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.account_list[n].password = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleAccountPicChange(evt) {
    var value = evt.target.value;
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.account_list[n].pic = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleAddAccount(evt) {
    var configCopy = this.state.postConfig;

    var text = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 32; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    configCopy.account_list.push({
      username: "",
      password: "",
      pic: "",
      auth: text,
    });

    this.setState({
      postConfig: configCopy,
    });
  }

  handleRemoveAccount(evt) {
    var n = evt.target.id.split("_")[1];

    var configCopy = this.state.postConfig;
    configCopy.account_list.splice(n, 1);

    this.setState({
      postConfig: configCopy,
    });
  }

  handleSecretChange(evt) {
    var value = evt.target.value;

    var configCopy = this.state.postConfig;
    configCopy.secret_key = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  handleTMDBAPIKeyChange(evt) {
    var value = evt.target.value;

    var configCopy = this.state.postConfig;
    configCopy.tmdb_api_key = value;

    this.setState({
      postConfig: configCopy,
    });
  }

  render() {
    let { config, isLoaded } = this.state;
    const { classes } = this.props;

    return isLoaded ? (
      <div className="Settings">
        <Nav />
        <form
          className={classes.Form}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <Typography variant="h3">Google Credentials</Typography>
          <TextField
            className="TextField"
            id="access_token"
            label="Access Token"
            type="text"
            variant="outlined"
            value={this.state.postConfig.access_token}
            onChange={this.handleAccessTokenChange}
            required
          />
          <TextField
            className="TextField"
            id="client_id"
            label="Client ID"
            type="text"
            variant="outlined"
            value={this.state.postConfig.client_id}
            onChange={this.handleClientIDChange}
            required
          />
          <TextField
            className="TextField"
            id="client_secret"
            label="Client Secret"
            type="text"
            variant="outlined"
            value={this.state.postConfig.client_secret}
            onChange={this.handleClientSecretChange}
            required
          />
          <TextField
            className="TextField"
            id="refresh_token"
            label="Refresh Token"
            type="text"
            variant="outlined"
            value={this.state.postConfig.refresh_token}
            onChange={this.handleRefreshTokenChange}
            required
          />
          <TextField
            className="TextField"
            id="token_expiry"
            label="Token Expiry"
            type="text"
            variant="outlined"
            value={this.state.postConfig.token_expiry}
            disabled
          />
          <br />
          <Typography variant="h3">Categories</Typography>
          {config.category_list.length
            ? config.category_list.map((category, n) => (
                <div style={{ margin: "30px" }}>
                  <TextField
                    className="TextField"
                    id={`category-type_${n}`}
                    select
                    label="Select Type"
                    variant="outlined"
                    value={`${this.state.postConfig.category_list[n].type}_${n}`}
                    onChange={this.handleCategoryTypeChange}
                  >
                    <MenuItem key={uuid()} value={`Movies_${n}`}>
                      Movies
                    </MenuItem>
                    <MenuItem key={uuid()} value={`TV Shows_${n}`}>
                      TV Shows
                    </MenuItem>
                    <MenuItem key={uuid()} value={`Other_${n}`}>
                      Other
                    </MenuItem>
                  </TextField>
                  <TextField
                    className="TextField"
                    id={`category-name_${n}`}
                    label="Name"
                    variant="outlined"
                    value={this.state.postConfig.category_list[n].name}
                    onChange={this.handleCategoryNameChange}
                    required
                  />
                  <TextField
                    className="TextField"
                    id={`category-id_${n}`}
                    label="Folder ID"
                    variant="outlined"
                    value={this.state.postConfig.category_list[n].id}
                    onChange={this.handleCategoryIdChange}
                    required
                  />
                  <TextField
                    className="TextField"
                    id={`category-driveId_${n}`}
                    label="Team Drive ID"
                    variant="outlined"
                    value={this.state.postConfig.category_list[n].driveId}
                    onChange={this.handleCategoryDriveIdChange}
                    required
                  />
                  <br />
                  <IconButton
                    aria-label="remove"
                    id={`category-remove_${n}`}
                    onClick={this.handleRemoveCategory}
                  >
                    <RemoveIcon id={`category-remove_${n}`} />
                  </IconButton>
                </div>
              ))
            : null}
          <IconButton aria-label="add" onClick={this.handleAddCategory}>
            <AddIcon />
          </IconButton>
          <Typography variant="h3">Accounts</Typography>
          {config.account_list.length
            ? config.account_list.map((account, n) => (
                <div style={{ margin: "30px" }}>
                  <TextField
                    className="TextField"
                    id={`account-username_${n}`}
                    label="Username"
                    variant="outlined"
                    value={this.state.postConfig.account_list[n].username}
                    onChange={this.handleAccountUsernameChange}
                    required
                  />
                  <TextField
                    className="TextField"
                    id={`account-password_${n}`}
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={this.state.postConfig.account_list[n].password}
                    onChange={this.handleAccountPasswordChange}
                    required
                  />
                  <TextField
                    className="TextField"
                    id={`account-pic_${n}`}
                    label="Picture"
                    variant="outlined"
                    value={this.state.postConfig.account_list[n].pic}
                    onChange={this.handleAccountPicChange}
                  />
                  <TextField
                    className="TextField"
                    id={`account-auth_${n}`}
                    label="Auth"
                    variant="outlined"
                    value={this.state.postConfig.account_list[n].auth}
                    disabled
                  />
                  <br />
                  <IconButton
                    aria-label="remove"
                    id={`account-remove_${n}`}
                    onClick={this.handleRemoveAccount}
                  >
                    <RemoveIcon id={`account-remove_${n}`} />
                  </IconButton>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    {(
                      <img
                        src={config.account_list[n].pic}
                        width="64px"
                        alt="profile-pic"
                      />
                    ) || <AccountCircle />}
                  </div>
                </div>
              ))
            : null}
          <IconButton aria-label="add" onClick={this.handleAddAccount}>
            <AddIcon />
          </IconButton>
          <Typography variant="h3">Secret Key</Typography>
          <TextField
            className="TextField"
            id="secret_key"
            label="Secret Key"
            type="password"
            variant="outlined"
            value={this.state.postConfig.secret_key}
            onChange={this.handleSecretChange}
            required
          />
          <Typography variant="h3">TMDB API Key</Typography>
          <TextField
            className="TextField"
            id="tmbd_api_key"
            label="TMDB API Key"
            type="text"
            variant="outlined"
            value={this.state.postConfig.tmdb_api_key}
            onChange={this.handleTMDBAPIKeyChange}
            required
          />
          <br />
          <div style={{ margin: "30px" }}>
            <Button
              style={{ marginRight: "20px" }}
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              target="_blank"
              href="https://libdrive-oauth2.netlify.app/"
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
        <ClipLoader color="#4197fe" size={75} />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Settings);
