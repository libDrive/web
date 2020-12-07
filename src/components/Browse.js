import React, { Component } from "react";

import { Puff } from "@agney/react-loading";

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
  }

  render() {
    let { isLoaded, metadata } = this.state;
    return isLoaded ? (
      <div className="Browse">
        <Nav />
        <Gallery metadata={metadata} />
      </div>
    ) : (
      <div className="Loading">
        <Puff width="80" className="loading__circle" />
      </div>
    );
  }
}
