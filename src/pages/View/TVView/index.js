import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Avatar, Button, Chip, Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import SubtitlesOutlinedIcon from "@material-ui/icons/SubtitlesOutlined";

import DPlayer from "react-dplayer";
import VTTConverter from "srt-webvtt";

import {
  ChildrenMenu,
  DownloadMenu,
  guid,
  PlayerMenu,
  PlaylistMenu,
  seo,
  theme,
} from "../../../components";

export class TVBView extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
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
            <div className="info__buttons">
              <ChildrenMenu state={this.state} />
            </div>
            <div className="info__genres">
              {metadata.genres && metadata.genres.length
                ? metadata.genres.map((genre) => (
                    <Link
                      to={`/genres?genre=${genre.name}`}
                      className="no_decoration_link"
                      key={guid()}
                    >
                      <Chip
                        avatar={<Avatar>{genre.name.charAt(0)}</Avatar>}
                        className="info__genre"
                        label={genre.name}
                        variant="outlined"
                      />
                    </Link>
                  ))
                : null}
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
    this.onFileChange = this.onFileChange.bind(this);
  }

  componentDidMount() {
    let { metadata, q } = this.state;

    seo({
      title: `libDrive - ${metadata.children[q].name}`,
      description: `Watch ${metadata.children[q].name} on libDrive!`,
      type: "video.episode",
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

  render() {
    let { file, metadata, q, server, sources, subtitle } = this.state;

    if (file) {
      subtitle = { url: file };
    }

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
        <div className="plyr__component">
          <DPlayer
            key={guid()}
            options={{
              video: {
                quality: sources,
                defaultQuality: defaultQuality,
                pic: `${server}/api/v1/image/thumbnail?id=${metadata.children[q].id}`,
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
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              marginTop: "25px",
              fontStyle: "bold",
              height: "1.2em",
              lineHeight: "1.2em",
              overflow: "hidden",
            }}
          >
            {metadata.name}
          </Typography>
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              marginTop: "15px",
              height: "1.2em",
              lineHeight: "1.2em",
              overflow: "hidden",
            }}
          >
            {metadata.children[q].name}
          </Typography>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "30px",
            }}
          >
            <PlayerMenu
              state={{
                auth: this.state.auth,
                id: metadata.children[q].id,
                metadata: metadata.children[q],
                server: server,
              }}
            />
            <DownloadMenu state={this.state} tv={true} />
            <PlaylistMenu state={this.state} />
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
        </div>
      </div>
    );
  }
}
