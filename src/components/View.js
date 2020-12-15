import React, { Component } from "react";

import { Typography } from "@material-ui/core";

import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";

import { Nav } from "../components";
import "./View.css";

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
    let { auth, id, server } = this.state;

    fetch(`${server}/api/v1/metadata?a=${auth}&id=${id}`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          metadata: data,
          isLoaded: true,
        })
      );
  }

  render() {
    let { auth, id, isLoaded, metadata, server } = this.state;

    return isLoaded ? (
      <div className="View">
        <Nav />
        <div className="plyr__component">
          <Plyr
            source={{
              type: "video",
              sources: [
                {
                  src: `${server}/api/v1/download?a=${auth}&id=${id}`,
                },
              ],
            }}
          />
        </div>
        <div className="info__container">
          <div className="info__left">
            <img className="info__poster" src={metadata.posterPath} />
          </div>
          <div className="info__right">
            <Typography variant="h2">{metadata.title}</Typography>
            <Typography variant="h6">({metadata.releaseDate})</Typography>
            <Typography variant="body1" style={{ marginTop: "30px" }}>
              {metadata.overview}
            </Typography>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    );
  }
}
