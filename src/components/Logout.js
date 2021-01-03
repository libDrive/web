import React, { Component } from "react";

import { Redirect } from "react-router-dom";

import ClipLoader from "react-spinners/ClipLoader";

export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false };
  }

  async componentDidMount() {
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => (this.setState({ isLoaded: true })), 500);
  }

  render() {
    let { isLoaded } = this.state;

    return isLoaded ? (
      <Redirect to="/login" />
    ) : (
      <div className="Loading">
        <ClipLoader color="#4197fe" size={75} />
      </div>
    );
  }
}
