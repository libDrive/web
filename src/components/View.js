import React, { Component } from "react";

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: {},
      id: this.props.match.params.id,
    };
  }

  componentDidMount() {
    fetch(
      `${this.state.server}/api/v1/metadata?a=${this.state.auth}&id=${this.state.id}`
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
    let { auth, id, isLoaded, metadata, server } = this.state

    return this.state.isLoaded ? (
      <div className="View">
      </div>
    ) : (
      <div></div>
    );
  }
}
