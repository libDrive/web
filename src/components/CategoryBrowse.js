import React, { Component } from "react";

import queryString from "query-string";

import { Gallery, Nav, PageMenu } from "../components";

export default class CategoryBrowse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: {},
      category: this.props.match.params.category,
      page: parseInt(queryString.parse(this.props.location.search).page) || 1,
      pages: 1,
      range: `${
        queryString.parse(this.props.location.search).page === undefined
          ? "0:16"
          : `${
              (parseInt(queryString.parse(this.props.location.search).page) -
                1) *
              16
            }:${
              parseInt(queryString.parse(this.props.location.search).page) * 16
            }`
      }`,
    };
  }

  componentDidMount() {
    fetch(
      `${this.state.server}/api/v1/metadata?a=${this.state.auth}&c=${this.state.category}&r=${this.state.range}&s=alphabet-des`
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          metadata: data,
          pages: Math.ceil(data[0]["length"]/16),
          isLoaded: true,
        })
      );
  }

  render() {
    return this.state.isLoaded ? (
      <div className="CategoryBrowse">
        <Nav />
        <Gallery metadata={this.state.metadata} />
        <PageMenu props={{ page: this.state.page, pages: this.state.pages }} />
      </div>
    ) : (
      <div></div>
    );
  }
}
