import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import { clear, guid, version } from "./components";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("_VERSION")) {
      localStorage.setItem("_VERSION", version);
    }
    if (localStorage.getItem("_VERSION") !== version) {
      clear();
      localStorage.setItem("_VERSION", version);
    }
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
