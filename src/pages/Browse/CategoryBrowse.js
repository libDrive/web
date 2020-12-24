import React, { Component } from "react";

import axios from "axios";
import queryString from "query-string";

import { Gallery, Nav, PageMenu } from "../../components";

export default class CategoryBrowse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      category: this.props.match.params.category,
      isLoaded: false,
      metadata: {},
      page: parseInt(queryString.parse(this.props.location.search).page) || 1,
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

  async componentDidMount() {
    let { auth, category, range, server } = this.state;
    let url = `${server}/api/v1/metadata?a=${auth}&c=${category}&r=${range}&s=alphabet-asc`;

    axios
      .get(url)
      .then((response) =>
        this.setState({
          isLoaded: true,
          metadata: response.data,
          pages: Math.ceil(response.data[0]["length"] / 16),
        })
      )
      .catch((error) => {
        console.error(error);
        if (auth == null || server == null) {
          alert("You are not authenticated");
          this.props.history.push("/logout");
        } else if (error.response) {
          if (error.response.status === 401) {
            alert("Your credentials are invalid. Logging you out now.");
            this.props.history.push("/logout");
          } else {
            alert("Something went wrong while communicating with the backend");
          }
        } else if (error.request) {
          alert(
            `libDrive could not communicate with the backend. Is ${server} the correct address?`
          );
        }
      });
  }

  render() {
    let { isLoaded, metadata, page, pages } = this.state;

    return isLoaded ? (
      <div className="CategoryBrowse">
        <Nav />
        <Gallery metadata={metadata} />
        <PageMenu props={{ page: page, pages: pages, thisprops: this.props }} />
      </div>
    ) : (
      <div className="Loading"></div>
    );
  }
}
