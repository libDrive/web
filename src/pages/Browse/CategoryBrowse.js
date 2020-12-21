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

    axios
      .get(
        `${server}/api/v1/metadata?a=${auth}&c=${category}&r=${range}&s=alphabet-asc`
      )
      .then((response) =>
        this.setState({
          isLoaded: true,
          metadata: response.data,
          pages: Math.ceil(response.data[0]["length"] / 16),
        })
      )
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401 || 404) {
            alert("Your credentials are invalid. Logging you out now.");
            this.props.history.push("/logout");
          } else {
            alert("Something went wrong while communicating with the backend");
            console.error(error);
          }
        } else if (error.request) {
          alert(
            `libDrive could not communicate with the backend. Is ${server} the correct address?`
          );
          console.error(error);
        } else {
          alert("Something seems to be wrong with the libDrive frontend");
          console.error(error);
        }
      });
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
      <div className="Loading"></div>
    );
  }
}
