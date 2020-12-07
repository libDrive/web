import React, { Component } from "react";

import { Puff } from "@agney/react-loading";

import { Gallery, Nav } from "../components";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: [],
      query: this.props.match.params.q,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  componentDidMount() {
    let { auth, query, server } = this.state
    fetch(
      `${server}/api/v1/metadata?a=${auth}&q=${query}`
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
    let { isLoaded, metadata } = this.state
    return isLoaded ? (
      <div className="Search">
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
