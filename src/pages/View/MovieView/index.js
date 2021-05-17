import React, { Component } from "react";

import { Avatar, Chip, Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import DPlayer from "react-dplayer";

import { DownloadMenu, PlayerMenu, theme } from "../../../components";

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
            <img
              className="info__backdrop"
              src={
                metadata.backdropPath ||
                `${server}/api/v1/image/backdrop?text=${metadata.title}&extention=jpeg`
              }
            />
          </div>
          <div className="info__right">
            <Typography
              variant="h3"
              style={{ fontWeight: "bold" }}
              className="info__title"
            >
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
            <div className="info__release">
              <Typography variant="body2">
                {metadata.language
                  ? `${this.prettyDate()} (${metadata.language.toUpperCase()})`
                  : this.prettyDate()}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignContent: "center",
                flexWrap: "wrap",
              }}
            >
              <PlayerMenu state={this.state} />
              <DownloadMenu state={this.state} />
            </div>
            <div className="info__genres">
              {metadata.adult ? (
                <Chip
                  color="secondary"
                  avatar={<Avatar>E</Avatar>}
                  style={{ marginRight: "8px", marginBottom: "8px" }}
                  label={"Adult (18+)"}
                  variant="outlined"
                />
              ) : null}
              {metadata.genres && metadata.genres.length
                ? metadata.genres.map((genre) => (
                    <Chip
                      avatar={<Avatar>{genre.name.charAt(0)}</Avatar>}
                      style={{ marginRight: "8px", marginBottom: "8px" }}
                      label={genre.name}
                      variant="outlined"
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
