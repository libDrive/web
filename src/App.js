import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  render() {
    return <Redirect to="/browse" />;
  }
}
