import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Nav from "./Nav";
import Gallery from "./Gallery";

export class Browse extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Gallery />
      </div>
    );
  }
}

export default withRouter(Browse);
