import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import DPlayer from "react-dplayer";

import {
  ChildrenMenu,
  guid,
  PlayerMenu,
  PlaylistMenu,
  theme,
} from "../../../components";

export class TVBView extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
    this.prettyDate = this.prettyDate.bind(this);
  }

  prettyDate() {
    let old_date = this.state.metadata.releaseDate;
    let date_comp = old_date.split("-");
    let date = new Date(date_comp[0], date_comp[1], date_comp[2]);
    return date.toDateString();
  }

  render() {
    let { metadata, server } = this.state;

    return (
      <div className="TVBView">
        <div className="info__container">
          <div className="info__left">
            <img
              className="info__poster"
              src={
                metadata.posterPath ||
                `${server}/api/v1/image/poster?text=${metadata.title}&extention=jpeg`
              }
            />
          </div>
          <div className="info__right">
            <Typography variant="h2" className="info__title">
              {metadata.title}
            </Typography>
            <Typography
              variant="body1"
              className="info__overview"
              style={{ marginTop: "30px" }}
            >
              {metadata.overview}
            </Typography>
            <div className="vote__container">
              <Rating
                name="Rating"
                value={metadata.voteAverage}
                max={10}
                readOnly
              />
            </div>
            <div className="release">
              <Typography variant="body2">{this.prettyDate()}</Typography>
            </div>
            <div className="buttons__container">
              <div className="button">
                <ChildrenMenu state={this.state} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class TVSView extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
  }

  render() {
    let { metadata, q, server, sources } = this.state;

    var defaultQuality;
    if (sources.length > 1) {
      defaultQuality = 1;
    } else {
      defaultQuality = 0;
    }

    function isHash(n, hash) {
      if (n === hash) {
        return "pls-playing";
      } else {
        return "";
      }
    }

    return (
      <div className="TVSView">
        <Typography
          variant="h2"
          style={{ textAlign: "center", marginTop: "25px" }}
        >
          {metadata.name}
        </Typography>
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "15px" }}
        >
          {metadata.children[q].name}
        </Typography>
        <div className="plyr__component">
          <DPlayer
            options={{
              video: {
                quality: sources,
                defaultQuality: defaultQuality,
                pic: `${server}/api/v1/image/thumbnail?id=${metadata.children[q].id}`,
              },
              preload: "auto",
              theme: theme.palette.primary.main,
              contextmenu: [
                {
                  text: "libDrive",
                  link: "https://github.com/libDrive/libDrive",
                },
              ],
              lang: "en",
            }}
          />
          <div className="plyr-playlist-wrapper">
            <ul className="plyr-playlist">
              {metadata.children.length
                ? metadata.children.map((child, n) => (
                    <li className={isHash(n, q)} key={n}>
                      <Link
                        to={{
                          pathname: window.location.pathname,
                          search: `?q=${n}`,
                        }}
                        key={guid()}
                      >
                        <img className="plyr-miniposter" />
                        {child.name}
                      </Link>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: "5vh" }}>
          <PlayerMenu state={this.state} />
          <PlaylistMenu state={this.state} />
        </div>
      </div>
    );
  }
}
