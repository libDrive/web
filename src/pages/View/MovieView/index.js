import React, { Component } from "react";

import { Avatar, Button, Chip, Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import SubtitlesOutlinedIcon from "@material-ui/icons/SubtitlesOutlined";

import DPlayer from "react-dplayer";
import VTTConverter from "srt-webvtt";

import {
  DownloadMenu,
  guid,
  PlayerMenu,
  seo,
  theme,
} from "../../../components";

export default class MovieView extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
    this.onFileChange = this.onFileChange.bind(this);
    this.prettyDate = this.prettyDate.bind(this);
  }

  componentDidMount() {
    let { metadata } = this.state;

    seo({
      title: `libDrive - ${metadata.title || metadata.name}`,
      description: `Watch ${metadata.title || metadata.name} on libDrive! — ${
        metadata.overview
      }`,
      image: metadata.backdropPath,
      type: "video.movie",
    });
  }

  async onFileChange(evt) {
    if (evt.target.files.length) {
      if (evt.target.files[0].name.endsWith(".srt")) {
        const vtt = new VTTConverter(evt.target.files[0]);
        let res = await vtt.getURL();
        this.setState({ file: res });
      } else {
        this.setState({ file: URL.createObjectURL(evt.target.files[0]) });
      }
    } else {
      this.setState({ file: null });
    }
  }

  prettyDate() {
    let old_date = this.state.metadata.releaseDate;
    let date_comp = old_date.split("-");
    let date = new Date(date_comp[0], date_comp[1], date_comp[2]);
    return date.toDateString();
  }

  render() {
    let { file, metadata, server, sources, subtitle } = this.state;

    if (file) {
      subtitle = { url: file };
    }

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
            key={guid()}
            options={{
              video: {
                quality: sources,
                defaultQuality: defaultQuality,
                pic:
                  metadata.backdropPath ||
                  `${server}/api/v1/image/thumbnail?id=${metadata.id}`,
              },
              subtitle: subtitle,
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
            <div className="info__buttons">
              <PlayerMenu state={this.state} />
              <DownloadMenu state={this.state} />
              <div className="info__button">
                <input
                  id="file-input"
                  hidden
                  onChange={this.onFileChange}
                  type="file"
                />
                <label htmlFor="file-input">
                  <Button color="primary" variant="outlined" component="span">
                    <SubtitlesOutlinedIcon />
                  </Button>
                </label>
              </div>
            </div>
            <div className="info__genres">
              {metadata.adult ? (
                <Chip
                  color="secondary"
                  avatar={<Avatar>E</Avatar>}
                  className="info__genre"
                  label={"Adult (18+)"}
                  variant="outlined"
                />
              ) : null}
              {metadata.genres && metadata.genres.length
                ? metadata.genres.map((genre) => (
                    <Chip
                      avatar={<Avatar>{genre.name.charAt(0)}</Avatar>}
                      className="info__genre"
                      label={genre.name}
                      key={guid()}
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
