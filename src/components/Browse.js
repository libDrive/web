import React, { Component } from "react";

import { Gallery, Nav } from "../components";

export default class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: {},
    };
  }

  componentDidMount() {
    fetch(
      `${this.state.server}/api/v1/metadata?a=${this.state.auth}&r=0:16&s=popularity-des`
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          metadata: data,
          isLoaded: true,
        })
      );
  }

  render() {
    return this.state.isLoaded ? (
      <div className="Browse">
        <Nav />
        <Gallery metadata={this.state.metadata} />
      </div>
    ) : (
      <div></div>
    );
  }
}
