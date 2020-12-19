import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import LoginForm from "./LoginForm";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: sessionStorage.getItem("loggedIn") };
  }
  render() {
    let { loggedIn } = this.state;
    
    if (loggedIn === "true") {
      return <Redirect to="/browse" />;
    } else {
      return <LoginForm />;
    }
  }
}
