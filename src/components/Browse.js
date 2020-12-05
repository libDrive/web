import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Nav from "./Nav";

export class Browse extends Component {
  render() {
    return (
      <div>
        <Nav />
      </div>
    );
  }
}

export default withRouter(Browse);
