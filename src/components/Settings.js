import React, { Component } from "react";

import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

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
      config: "",
      error: "",
      isLoaded: false,
      secret: "elias",
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };

    this.handleCategoryTypeChange = this.handleCategoryTypeChange.bind(this);
    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
    this.handleCategoryIdChange = this.handleCategoryIdChange.bind(this);
    this.handleCategoryDriveIdChange = this.handleCategoryDriveIdChange.bind(
      this
    );
    this.handleSecretChange = this.handleSecretChange.bind(this);
    this.handleAccountUsernameChange = this.handleAccountUsernameChange.bind(
      this
    );
    this.handleAccountPasswordChange = this.handleAccountPasswordChange.bind(
      this
    );
    this.handleAccountPicChange = this.handleAccountPicChange.bind(this);
    this.dismissError = this.dismissError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let { auth, secret, server } = this.state;

    fetch(`${server}/api/v1/config?secret=${secret}`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          config: data,
          tempSecret: data.secret_key,
        })
      )
      .then(() =>
        this.state.config.category_list.map((category, n) =>
          eval(
            `this.setState({
              category${n}name: category.name,
              category${n}type: category.type,
              category${n}id: category.id,
              category${n}driveid: category.driveId,
            })`
          )
        )
      )
      .then(() =>
        this.state.config.account_list.map((account, n) =>
          eval(
            `this.setState({
              account${n}username: account.username,
              account${n}password: account.password,
              account${n}pic: account.pic,
              account${n}auth: account.auth,
            })`
          )
        )
      )
      .then(() => this.setState({ isLoaded: true }));
    fetch(`${server}/api/v1/auth?a=${auth}`).then((response) => {
      if (!response.ok) {
        window.location.href = "logout";
      }
    });
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let { config, secret, server, tempSecret } = this.state;
    let postEnvironment = {
      account_list: [],
      category_list: [],
      secret_key: tempSecret,
    };

    config.category_list.map(
      (category, n) =>
        (postEnvironment["category_list"][n] = {
          name: eval(`this.state.category${n}name`),
          type: eval(`this.state.category${n}type`),
          id: eval(`this.state.category${n}id`),
          driveId: eval(`this.state.category${n}driveid`),
        })
    );

    config.account_list.map(
      (category, n) =>
        (postEnvironment["account_list"][n] = {
          username: eval(`this.state.account${n}username`),
          password: eval(`this.state.account${n}password`),
          pic: eval(`this.state.account${n}pic`),
          auth: eval(`this.state.account${n}auth`),
        })
    );

    fetch(`${server}/api/v1/config?secret=${secret}`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postEnvironment),
    }).then((response) => {
      if (response.ok) {
        alert(
          "The config has been updated on the backend. The backend may need to be restarted for some settings to update."
        );
      }
    });
  }

  handleCategoryTypeChange(evt) {
    var value = evt.target.value;
    var splitValue = value.split("_");
    var n = splitValue[1];
    eval(
      `this.setState({
        category${n}type: splitValue[0],
      })`
    );
  }

  handleCategoryNameChange(evt) {
    var key = evt.target.id;
    var splitKey = key.split("_");
    var n = splitKey[1];
    eval(
      `this.setState({
        category${n}name: evt.target.value,
      })`
    );
  }

  handleCategoryIdChange(evt) {
    var key = evt.target.id;
    var splitKey = key.split("_");
    var n = splitKey[1];
    eval(
      `this.setState({
        category${n}id: evt.target.value,
      })`
    );
  }

  handleCategoryDriveIdChange(evt) {
    var key = evt.target.id;
    var splitKey = key.split("_");
    var n = splitKey[1];
    eval(
      `this.setState({
        category${n}driveid: evt.target.value,
      })`
    );
  }

  handleSecretChange(evt) {
    this.setState({
      tempSecret: evt.target.value,
    });
  }

  handleAccountUsernameChange(evt) {
    var key = evt.target.id;
    var splitKey = key.split("_");
    var n = splitKey[1];
    eval(
      `this.setState({
        account${n}username: evt.target.value,
      })`
    );
  }

  handleAccountPasswordChange(evt) {
    var key = evt.target.id;
    var splitKey = key.split("_");
    var n = splitKey[1];
    eval(
      `this.setState({
        account${n}password: evt.target.value,
      })`
    );
  }

  handleAccountPicChange(evt) {
    var key = evt.target.id;
    var splitKey = key.split("_");
    var n = splitKey[1];
    eval(
      `this.setState({
        account${n}pic: evt.target.value,
      })`
    );
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
                    value={`${eval(`this.state.category${n}type`)}_${n}`}
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
                    value={eval(`this.state.category${n}name`)}
                    onChange={this.handleCategoryNameChange}
                  />
                  <TextField
                    className="TextField"
                    id={`category-id_${n}`}
                    label="Folder ID"
                    variant="outlined"
                    value={eval(`this.state.category${n}id`)}
                    onChange={this.handleCategoryIdChange}
                  />
                  <TextField
                    className="TextField"
                    id={`category-driveId_${n}`}
                    label="Team Drive ID"
                    variant="outlined"
                    value={eval(`this.state.category${n}driveid`)}
                    onChange={this.handleCategoryDriveIdChange}
                  />
                </div>
              ))
            : null}
          <Typography variant="h3">Secret Key</Typography>
          <TextField
            className="TextField"
            id="outlined-basic"
            label="Secret Key"
            type="password"
            variant="outlined"
            value={config.secret_key}
            onChange={this.handleSecretChange}
          />
          <Typography variant="h3">Accounts</Typography>
          {config.account_list.length
            ? config.account_list.map((account, n) => (
                <div style={{ margin: "30px" }}>
                  <TextField
                    className="TextField"
                    id={`account-username_${n}`}
                    label="Username"
                    variant="outlined"
                    value={eval(`this.state.account${n}username`)}
                    onChange={this.handleAccountUsernameChange}
                  />
                  <TextField
                    className="TextField"
                    id={`account-password_${n}`}
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={eval(`this.state.account${n}password`)}
                    onChange={this.handleAccountPasswordChange}
                  />
                  <TextField
                    className="TextField"
                    id={`account-pic_${n}`}
                    label="Picture"
                    variant="outlined"
                    value={eval(`this.state.account${n}pic`)}
                    onChange={this.handleAccountPicChange}
                  />
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
