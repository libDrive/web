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

  componentDidMount() {
    /*
    let { auth, server } = this.state;
    fetch(`${server}/api/v1/auth?a=${auth}`).then((response) => {
      if (!response.ok) {
        window.location.href = "/logout";
      } else if (response.ok) {
        window.location.href = "/browse";
      }
    });
    */
  }

  render() {
    return <Redirect to="/browse" />;
  }
}
