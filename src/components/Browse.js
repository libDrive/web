import React, { Component } from "react";

import { Gallery, Nav } from "../components";

export default class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: {},
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  componentDidMount() {
    let { auth, server } = this.state;

    fetch(`${server}/api/v1/metadata?a=${auth}&r=0:16&s=popularity-des`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          isLoaded: true,
          metadata: data,
        })
      );
    fetch(`${server}/api/v1/auth?a=${auth}`).then((response) => {
      if (!response.ok) {
        window.location.href = "/logout";
      }
    });
  }

  render() {
    let { isLoaded, metadata } = this.state;

    return isLoaded ? (
      <div className="Browse">
        <Nav />
        <Gallery metadata={metadata} />
      </div>
    ) : (
      <div className="Loading"></div>
    );
  }
}
