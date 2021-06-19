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
      server:
        sessionStorage.getItem("server") ||
        localStorage.getItem("server") ||
        window.location.origin,
    };
  }

  componentDidMount() {
    let { auth, server } = this.state;

    axios.get(`${server}/api/v1/environment?a=${auth}`).then((response) => {
      let data = response.data;
      this.setState({
        accounts: data.content.account_list,
        categories: data.content.category_list,
        isLoaded: true,
      });
    });
  }

  render() {
    let { accounts, categories, isLoaded } = this.state;

    return isLoaded ? (
      <div className="Nav">
        <NavUI
          state={{ accounts: accounts, categories: categories, query: this.props.query }}
          {...this.props}
        />
      </div>
    ) : isLoaded ? (
      <div className="Nav">
        <NavUI
          state={{ accounts: accounts, categories: categories, query: this.props.query }}
          {...this.props}
        />
      </div>
    ) : (
      <NavUI state={{ accounts: [], categories: [], query: this.props.query }} {...this.props} />
    );
  }
}
