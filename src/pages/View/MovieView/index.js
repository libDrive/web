import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import DPlayer from "react-dplayer";

import { PlayerMenu, theme } from "../../../components";

export default class MovieView extends Component {
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
    let { metadata, server, sources } = this.state;

    var defaultQuality;
    if (sources.length > 1) {
      defaultQuality = 1;
    } else {
      defaultQuality = 0;
    }

    return (
      <div className="MovieView">
        <div className="plyr__component">
          <DPlayer
            options={{
              video: {
                quality: sources,
                defaultQuality: defaultQuality,
                pic:
                  metadata.backdropPath ||
                  `${server}/api/v1/image/thumbnail?id=${metadata.id}`,
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
        </div>
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
            <PlayerMenu state={this.state} />
          </div>
        </div>
      </div>
    );
  }
}
