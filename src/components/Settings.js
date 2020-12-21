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

import axios from "axios";

import { Nav } from "../components";

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

    this.handleCategoryTypeChange = this.handleCategoryTypeChange.bind(this);
    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
    this.handleCategoryIdChange = this.handleCategoryIdChange.bind(this);
    this.handleCategoryDriveIdChange = this.handleCategoryDriveIdChange.bind(
      this
    );
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
    this.handleSecretChange = this.handleSecretChange.bind(this);
    this.handleAccountUsernameChange = this.handleAccountUsernameChange.bind(
      this
    );
    this.handleAccountPasswordChange = this.handleAccountPasswordChange.bind(
      this
    );
    this.handleAccountPicChange = this.handleAccountPicChange.bind(this);
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.handleRemoveAccount = this.handleRemoveAccount.bind(this);
    this.dismissError = this.dismissError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
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
        if (error.response) {
          if (error.response.status === 401) {
            alert("Your credentials are invalid. Logging you out now.");
            this.props.history.push("/settings/login");
          } else {
            alert("Something went wrong while communicating with the backend");
            console.error(error);
          }
        } else if (error.request) {
          alert(
            `libDrive could not communicate with the backend. Is ${server} the correct address?`
          );
          console.error(error);
        } else {
          alert("Something seems to be wrong with the libDrive frontend");
          console.error(error);
        }
      });
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let { secret, server } = this.state;

    fetch(`${server}/api/v1/config?secret=${secret}`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.postConfig),
    }).then((response) => {
      if (response.ok) {
        alert(
          "The config has been updated on the backend. The backend may need to be restarted for some settings to update."
        );
      }
    });
    axios
      .post(`${server}/api/v1/config?secret=${secret}`, this.state.postConfig)
      .then((response) => {
        alert(
          "The config has been updated on the backend. The backend may need to be restarted for some settings to update."
        );
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            alert("Your credentials are invalid. Logging you out now.");
            this.props.history.push("/settings/login");
          } else {
            alert("Something went wrong while communicating with the backend");
            console.error(error);
          }
        } else if (error.request) {
          alert(
            `libDrive could not communicate with the backend. Is ${server} the correct address?`
          );
          console.error(error);
        } else {
          alert("Something seems to be wrong with the libDrive frontend");
          console.error(error);
        }
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

  handleSecretChange(evt) {
    var value = evt.target.value;

    var configCopy = this.state.postConfig;
    configCopy.secret_key = value;

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
    configCopy.account_list.push({ username: "", password: "", pic: "" });

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
          <a className="no_decoration_link" href="#categories">
            <Typography variant="h3">Categories</Typography>
          </a>
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
                    <MenuItem key="movies" value={`movies_${n}`}>
                      Movies
                    </MenuItem>
                    <MenuItem key="tv" value={`tv_${n}`}>
                      TV Shows
                    </MenuItem>
                    <MenuItem key="other" value={`other_${n}`}>
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
                  />
                  <TextField
                    className="TextField"
                    id={`category-id_${n}`}
                    label="Folder ID"
                    variant="outlined"
                    value={this.state.postConfig.category_list[n].id}
                    onChange={this.handleCategoryIdChange}
                  />
                  <TextField
                    className="TextField"
                    id={`category-driveId_${n}`}
                    label="Team Drive ID"
                    variant="outlined"
                    value={this.state.postConfig.category_list[n].driveId}
                    onChange={this.handleCategoryDriveIdChange}
                  />
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
          <a className="no_decoration_link" href="#secret">
            <Typography variant="h3">Secret Key</Typography>
          </a>
          <TextField
            className="TextField"
            id="outlined-basic"
            label="Secret Key"
            type="password"
            variant="outlined"
            value={this.state.postConfig.secret_key}
            onChange={this.handleSecretChange}
          />
          <a className="no_decoration_link" href="#accounts">
            <Typography variant="h3">Accounts</Typography>
          </a>
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
                  />
                  <TextField
                    className="TextField"
                    id={`account-password_${n}`}
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={this.state.postConfig.account_list[n].password}
                    onChange={this.handleAccountPasswordChange}
                  />
                  <TextField
                    className="TextField"
                    id={`account-pic_${n}`}
                    label="Picture"
                    variant="outlined"
                    value={this.state.postConfig.account_list[n].pic}
                    onChange={this.handleAccountPicChange}
                  />
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
          <br></br>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            block
          >
            Submit
          </Button>
        </form>
      </div>
    ) : (
      <div className="Loading"></div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Settings);
