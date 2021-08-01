import React, { Component } from "react";

import { Link } from "react-router-dom";

import {
  Avatar,
  Button,
  Chip,
  ClickAwayListener,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
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
  StarDialog,
  theme,
} from "../../../components";

export class TVBView extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.state, tooltipOpen: false };
    this.prettyDate = this.prettyDate.bind(this);
    this.handleStar = this.handleStar.bind(this);
    this.handleStarClose = this.handleStarClose.bind(this);
  }

  componentDidMount() {
    let { metadata, ui_config } = this.state;

    seo({
      title: `${ui_config.title || "libDrive"} - ${
        metadata.title || metadata.name
      }`,
      description: `Watch ${metadata.title || metadata.name} on ${
        ui_config.title || "libDrive"
      }! — ${metadata.overview}`,
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

  handleStar() {
    this.setState({ openStarDialog: true });
  }

  handleStarClose(evt) {
    if (evt == "starred") {
      this.setState({ openStarDialog: false, starred: true });
    } else if (evt == "unstarred") {
      this.setState({
        openStarDialog: false,
        starred:
          JSON.parse(localStorage.getItem("starred_lists") || "[]").some((i) =>
            i.children.some((x) => x.id == this.state.metadata.id)
          ) || false,
      });
    } else {
      this.setState({ openStarDialog: false });
    }
  }

  render() {
    let { metadata, server, starred, tooltipOpen } = this.state;

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
            <ClickAwayListener
              onClickAway={() => this.setState({ tooltipOpen: false })}
            >
              <Tooltip
                title={
                  <Typography variant="subtitle2">{metadata.name}</Typography>
                }
                arrow
                placement="bottom-start"
                open={tooltipOpen}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                onClose={() => this.setState({ tooltipOpen: false })}
                PopperProps={{
                  disablePortal: true,
                }}
              >
                <Typography
                  onClick={() => this.setState({ tooltipOpen: true })}
                  variant="h3"
                  style={{ fontWeight: "bold" }}
                  className="info__title"
                >
                  {metadata.title}
                </Typography>
              </Tooltip>
            </ClickAwayListener>
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
              <IconButton onClick={this.handleStar}>
                {starred ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              <Typography
                style={{ display: "flex", alignItems: "center" }}
                variant="body2"
              >
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
                      to={`/genres?genre=${genre}`}
                      className="no_decoration_link"
                      key={guid()}
                    >
                      <Chip
                        avatar={<Avatar>{genre.charAt(0)}</Avatar>}
                        className="info__genre"
                        label={genre}
                        variant="outlined"
                      />
                    </Link>
                  ))
                : null}
            </div>
          </div>
        </div>
        <StarDialog
          isOpen={this.state.openStarDialog}
          handleClose={this.handleStarClose}
          metadata={metadata}
        />
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
    let { metadata, q, ui_config } = this.state;

    seo({
      title: `${ui_config.title || "libDrive"} - ${metadata.children[q].name}`,
      description: `Watch ${metadata.children[q].name} on ${
        ui_config.title || "libDrive"
      }!`,
      type: "video.episode",
    });
  }

  componentWillUnmount() {
    let { id, q, watching } = this.state;

    watching[id] = q;

    localStorage.setItem("watching", JSON.stringify(watching));
  }

  async onFileChange(evt) {
    if (evt.target.files.length) {
      if (evt.target.files[0].name.endsWith(".srt")) {
        const vtt = new VTTConverter(evt.target.files[0]);
        let res = await vtt.getURL();
        this.setState({ file: res, playerKey: guid() });
      } else {
        this.setState({
          file: URL.createObjectURL(evt.target.files[0]),
          playerKey: guid(),
        });
      }
    } else {
      this.setState({ file: null, playerKey: guid() });
    }
  }

  render() {
    let {
      default_quality,
      file,
      metadata,
      playerKey,
      q,
      server,
      sources,
      subtitle,
    } = this.state;

    if (file) {
      subtitle = { url: file };
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
            key={playerKey}
            options={{
              video: {
                quality: sources,
                defaultQuality: default_quality,
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
                ...this.state,
                id: metadata.children[q].id,
                metadata: metadata.children[q],
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
