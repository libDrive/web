import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class App extends Component {
  render() {
    if (sessionStorage.getItem("loggedIn") === "true") {
      return <Redirect to="/browse" />;
    } else if (localStorage.getItem("loggedIn") === "true") {
      sessionStorage.setItem("loggedIn", true);
      return <Redirect to="/browse" />;
    } else {
      return <Redirect to="login" />;
    }
  }
}
