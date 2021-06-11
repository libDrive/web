import React, { Component } from "react";

import axios from "axios";

import NavUI from "./NavUI";

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {},
      auth:
        sessionStorage.getItem("auth") || localStorage.getItem("auth") || "0",
      categories: [],
      isLoaded: false,
      news: [],
      server:
        sessionStorage.getItem("server") ||
        localStorage.getItem("server") ||
        window.location.origin,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    let { auth, server } = this.state;

    await axios
      .get(`${server}/api/v1/environment?a=${auth}`)
      .then((response) => {
        let data = response.data;
        this.setState({
          accounts: data.content.account_list,
          categories: data.content.category_list,
        });
      });

    await axios
      .get("https://api.github.com/repos/libDrive/libDrive/releases")
      .then((response) => {
        let data = response.data;
        this.setState({
          news: data,
          isLoaded: true,
        });
      });
  };

  render() {
    let { accounts, categories, isLoaded, news } = this.state;

    return isLoaded && news.length ? (
      <div className="Nav">
        <NavUI
          state={{ accounts: accounts, categories: categories, news: news }}
          {...this.props}
        />
      </div>
    ) : isLoaded ? (
      <div className="Nav">
        <NavUI
          state={{ accounts: accounts, categories: categories, news: [] }}
          {...this.props}
        />
      </div>
    ) : (
      <NavUI
        state={{ accounts: [], categories: [], news: [] }}
        {...this.props}
      />
    );
  }
}
