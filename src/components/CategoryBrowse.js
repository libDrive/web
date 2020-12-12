import React, { Component } from "react";

import queryString from "query-string";

import { Gallery, Nav, PageMenu } from "../components";

export default class CategoryBrowse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      category: this.props.match.params.category,
      isLoaded: false,
      metadata: {},
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
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  componentDidMount() {
    let { auth, category, range, server } = this.state;
    fetch(
      `${server}/api/v1/metadata?a=${auth}&c=${category}&r=${range}&s=alphabet-des`
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          metadata: data,
          pages: Math.ceil(data[0]["length"] / 16),
          isLoaded: true,
        })
      );
  }

  render() {
    let { isLoaded, metadata, page, pages } = this.state;
    return isLoaded ? (
      <div className="CategoryBrowse">
        <Nav />
        <Gallery metadata={metadata} />
        <PageMenu props={{ page: page, pages: pages }} />
      </div>
    ) : (
      <div className="Loading">
      </div>
    );
  }
}
