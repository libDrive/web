import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Nav from "./Nav";

export class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: [],
    };
  }
  componentDidMount() {
    fetch(
      `${this.state.server}/api/v1/metadata?a=${this.state.auth}&q=${this.props.match.params.q}`
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
    console.log(this.state.metadata);
    return this.state.isLoaded ? (
      <div className="Search">
        <Nav />
      </div>
      ) : (
        <div></div>
      );
  }
}

export default withRouter(Search);
