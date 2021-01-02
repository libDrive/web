import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class Logout extends Component {
  render() {
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push("/login");
    return <Redirect to="/login" />;
  }
}
