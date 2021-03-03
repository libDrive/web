import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import { guid } from "./components";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  render() {
    let { auth, server } = this.state;
    return auth && server ? (
      <Redirect to="/browse" key={guid()} />
    ) : (
      <Redirect to="/login" key={guid()} />
    );
  }
}
