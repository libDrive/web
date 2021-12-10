import React, { Component } from "react";

import { Link } from "react-router-dom";

import {
  Avatar,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import SubtitlesOutlinedIcon from "@material-ui/icons/SubtitlesOutlined";
import YouTubeIcon from "@material-ui/icons/YouTube";

import DPlayer from "libdrive-player";
import { default as toWebVTT } from "srt-webvtt";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import axios from "axios";

import {
  DownloadMenu,
  guid,
  PlayerMenu,
  seo,
  StarDialog,
  theme,
  TrailerDialog,
} from "../../../components";

export default class MovieView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.state,
      subtitleMenuAnchor: false,
      tooltipOpen: false,
      tooltipOpen2: false,
      trailer: {},
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.prettyDate = this.prettyDate.bind(this);
    this.handleStar = this.handleStar.bind(this);
    this.handleStarClose = this.handleStarClose.bind(this);
    this.handleTrailer = this.handleTrailer.bind(this);
    this.handleTrailerClose = this.handleTrailerClose.bind(this);
    this.handleSubtitleMenuOpen = this.handleSubtitleMenuOpen.bind(this);
    this.handleSubtitleMenuClose = this.handleSubtitleMenuClose.bind(this);
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

  async onFileChange(evt) {
    if (evt.target.files.length) {
      if (evt.target.files[0].name.endsWith(".srt")) {
        const vtt = await toWebVTT(evt.target.files[0]);
        this.setState({
          file: vtt,
          fileName: evt.target.files[0].name,
          playerKey: guid(),
        });
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
          JSON.parse(window.localStorage.getItem("starred_lists") || "[]").some(
            (i) => i.children.some((x) => x.id == this.state.metadata.id)
          ) || false,
      });
    } else {
      this.setState({ openStarDialog: false });
    }
  }

  handleTrailer() {
    let { auth, metadata, server } = this.state;

    let req_path = `${server}/api/v1/trailer/${metadata.apiId}`;
    let req_args = `?a=${auth}&t=movie&api=${metadata.api}`;

    axios
      .get(req_path + req_args)
      .then((response) =>
        this.setState({
          openTrailerDialog: true,
          trailer: response.data.content,
        })
      )
      .catch((error) => {
        console.error(error);
        if (error.response) {
          let data = error.response.data;
          if (data.code === 401) {
            Swal.fire({
              title: "Error!",
              text: data.message,
              icon: "error",
              confirmButtonText: "Login",
              confirmButtonColor: theme.palette.success.main,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              }
            });
          } else if (!server) {
            this.props.history.push("/logout");
          } else {
            Swal.fire({
              title: "Error!",
              text: "No trailer could be found.",
              icon: "error",
              confirmButtonText: "Ok",
              confirmButtonColor: theme.palette.success.main,
            });
          }
        } else if (error.request) {
          if (!server) {
            this.props.history.push("/logout");
          } else {
            Swal.fire({
              title: "Error!",
              text: `libDrive could not communicate with the server! Is '${server}' the correct address?`,
              icon: "error",
              confirmButtonText: "Logout",
              confirmButtonColor: theme.palette.success.main,
              cancelButtonText: "Retry",
              cancelButtonColor: theme.palette.error.main,
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.props.history.push("/logout");
              } else if (result.isDismissed) {
                location.reload();
              }
            });
          }
        }
      });
  }

  handleTrailerClose() {
    this.setState({ openTrailerDialog: false });
  }

  handleSubtitleMenuOpen(evt) {
    let { tracks } = this.state;

    if (tracks.length) {
      this.setState({
        subtitleMenuAnchor: evt.currentTarget,
      });
    } else {
      const subtitleButton = document.getElementById("file-input-button");
      subtitleButton.click();
    }
  }

  handleSubtitleMenuClose() {
    this.setState({
      subtitleMenuAnchor: false,
    });
  }

  render() {
    let {
      default_track,
      default_video,
      file,
      fileName,
      metadata,
      playerKey,
      server,
      videos,
      starred,
      subtitleMenuAnchor,
      tracks,
      tooltipOpen,
      tooltipOpen2,
      trailer,
    } = this.state;

    if (file) {
      tracks = [{ name: fileName, url: file }];
    }

    return (
      <div className="MovieView">
        <div className="plyr__component">
          <DPlayer
            key={playerKey}
            style={{
              borderRadius: "12px",
              borderWidth: "5px",
              borderColor: "black",
              borderStyle: "solid",
            }}
            options={{
              video: {
                quality: videos,
                defaultQuality: default_video,
                pic:
                  metadata.backdropPath ||
                  `${server}/api/v1/image/thumbnail?id=${metadata.id}`,
              },
              subtitle: tracks[default_track],
              preload: "auto",
              theme: theme.palette.primary.main,
              contextmenu: [
                {
                  text: "libDrive",
                  link: "https://github.com/libDrive/libDrive",
                },
              ],
              screenshot: true,
              volume: 1,
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
                `${server}/api/v1/image/poster?text=${encodeURIComponent(
                  metadata.title
                )}&extention=jpeg`
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
                placement="top-start"
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
              <ClickAwayListener
                onClickAway={() => this.setState({ tooltipOpen2: false })}
              >
                <Tooltip
                  title={
                    <Typography variant="subtitle2">
                      {metadata.voteAverage}/10
                    </Typography>
                  }
                  arrow
                  placement="right"
                  open={tooltipOpen2}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  onClose={() => this.setState({ tooltipOpen2: false })}
                  PopperProps={{
                    disablePortal: true,
                  }}
                >
                  <div onClick={() => this.setState({ tooltipOpen2: true })}>
                    <Rating
                      name="Rating"
                      value={metadata.voteAverage}
                      max={10}
                      readOnly
                    />
                  </div>
                </Tooltip>
              </ClickAwayListener>
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
              <PlayerMenu state={this.state} />
              <DownloadMenu state={this.state} />
              <div className="info__button">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ width: "135px" }}
                  onClick={this.handleTrailer}
                  startIcon={<YouTubeIcon />}
                >
                  Trailer
                </Button>
              </div>
              <div className="info__button">
                <input
                  id="file-input"
                  hidden
                  onChange={this.onFileChange}
                  type="file"
                  accept=".vtt,.srt"
                />
                <Button
                  color="primary"
                  variant="outlined"
                  style={{ width: "135px" }}
                  component="span"
                  aria-controls="subtitles-menu"
                  startIcon={<SubtitlesOutlinedIcon />}
                  onClick={this.handleSubtitleMenuOpen}
                >
                  Subtitle
                </Button>
                <Menu
                  id="subtitles-menu"
                  anchorEl={subtitleMenuAnchor}
                  keepMounted
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  open={Boolean(subtitleMenuAnchor)}
                  onClose={this.handleSubtitleMenuClose}
                >
                  {tracks.length ? (
                    <div>
                      {tracks.map((track) => (
                        <a className="no_decoration_link" href={track.url}>
                          <MenuItem onClick={this.handleSubtitleMenuClose}>
                            {track.name}
                          </MenuItem>
                        </a>
                      ))}
                      <Divider />
                    </div>
                  ) : null}
                  <MenuItem
                    onClick={() => {
                      document.getElementById("file-input-button").click();
                      this.setState({ subtitleMenuAnchor: false });
                    }}
                  >
                    Upload
                  </MenuItem>
                </Menu>
                <label htmlFor="file-input" id="file-input-button" />
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
        <TrailerDialog
          isOpen={this.state.openTrailerDialog}
          handleClose={this.handleTrailerClose}
          metadata={metadata}
          trailer={trailer}
        />
      </div>
    );
  }
}
