import React, { Component } from "react";

import { Link } from "react-router-dom";

import { IconButton, Tooltip, Typography } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import RoomIcon from "@material-ui/icons/Room";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import StarIcon from "@material-ui/icons/Star";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import { guid, theme } from "../../components";
import "./index.css";

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: props.hide || false,
      metadata: this.props.metadata,
      server:
        window.sessionStorage.getItem("server") ||
        window.localStorage.getItem("server") ||
        window.location.origin,
      star: props.star,
    };
    this.handleStar = this.handleStar.bind(this);
    this.handleStarReset = this.handleStarReset.bind(this);
    this.handleStarImport = this.handleStarImport.bind(this);
    this.handleStarExport = this.handleStarExport.bind(this);
    this.handlePin = this.handlePin.bind(this);
  }

  handleStar(item, category) {
    let { metadata } = this.state;
    let starred_lists = JSON.parse(
      window.localStorage.getItem("starred_lists") || "[]"
    );

    try {
      let index1 = starred_lists.findIndex((i) => i.id == category.id);
      let index2 = starred_lists[index1].children.findIndex(
        (i) => i.id == item.id
      );
      let index3 = metadata.findIndex((i) => i.id == category.id);
      let index4 = metadata[index3].children.findIndex((i) => i.id == item.id);
      starred_lists[index1].children.splice(index2, 1);
      metadata[index3].children.splice(index4, 1);
      window.localStorage.setItem(
        "starred_lists",
        JSON.stringify(starred_lists)
      );
      this.setState({ metadata: metadata });
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Your starred list seems to be corrupted!",
        icon: "error",
        confirmButtonText: "Reset",
        confirmButtonColor: theme.palette.success.main,
        cancelButtonText: "Ignore",
        cancelButtonColor: theme.palette.error.main,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.localStorage.setItem("starred_lists", "[]");
          location.reload();
        }
      });
    }
  }

  handleStarReset(evt) {
    let { metadata } = this.state;

    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to delete this starred list?",
      icon: "warning",
      confirmButtonText: "Delete",
      confirmButtonColor: theme.palette.success.main,
      cancelButtonText: "No",
      cancelButtonColor: theme.palette.error.main,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let starred_lists = JSON.parse(
          window.localStorage.getItem("starred_lists") || "[]"
        );
        if (starred_lists.length == 1) {
          starred_lists.shift();
          metadata.shift();
        } else {
          starred_lists.splice(evt, 1);
          metadata.splice(evt, 1);
        }
        window.localStorage.setItem(
          "starred_lists",
          JSON.stringify(starred_lists)
        );
        this.setState({ metadata: metadata });
      }
    });
  }

  handleStarImport(evt) {
    if (evt.target.files.length) {
      var file = evt.target.files[0];
      var reader = new FileReader();
      reader.onload = (evtR) => {
        let starred_lists = JSON.parse(
          window.localStorage.getItem("starred_lists") || "[]"
        );
        let starred_list = JSON.parse(evtR.target.result);
        let i = parseInt(evt.target.id.replace("file-input-", ""));
        starred_lists[i].children = starred_list.children;
        window.localStorage.setItem(
          "starred_lists",
          JSON.stringify(starred_lists)
        );
        let { metadata } = this.state;
        if (metadata.length && metadata[i].type == "Starred") {
          metadata[i].children = starred_list.children;
          this.setState({
            metadata: metadata,
          });
        }
      };
      reader.readAsText(file);
    }
  }

  handleStarExport(evt) {
    let starred_lists = JSON.parse(
      window.localStorage.getItem("starred_lists") || "[]"
    );
    let starred_list = starred_lists[evt];

    const file = new Blob([JSON.stringify(starred_list)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = `libdrive-starred-${starred_list.name}-${+new Date()}.json`;
    link.click();
  }

  handlePin(evt, pin) {
    let starred_lists = JSON.parse(
      window.localStorage.getItem("starred_lists") || "[]"
    );
    if (!pin) {
      starred_lists[evt].categoryInfo.pinned = false;
      window.localStorage.setItem(
        "starred_lists",
        JSON.stringify(starred_lists)
      );
      this.setState({ metadata: starred_lists });
    } else {
      starred_lists[evt].categoryInfo.pinned = true;
      window.localStorage.setItem(
        "starred_lists",
        JSON.stringify(starred_lists)
      );
      this.setState({ metadata: starred_lists });
    }
  }

  render() {
    let { hide, metadata, server, star } = this.state;

    return star ? (
      <div className="Carousel" style={{ paddingTop: "3%" }}>
        {metadata.length
          ? metadata.map((category, p) =>
              category.children.length || !hide ? (
                <div
                  className="carousel__category"
                  style={{ margin: "0 auto 0 auto" }}
                  key={guid()}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          float: "left",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to={"#"}
                          className="carousel__category__title no_decoration_link"
                        >
                          {category.categoryInfo.name}
                        </Link>
                        <Tooltip title="Delete" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => this.handleStarReset(p)}
                            style={{ marginLeft: "10px" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div
                        style={{
                          float: "right",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          id={`file-input-${p}`}
                          hidden
                          onChange={this.handleStarImport}
                          type="file"
                        />
                        <label htmlFor={`file-input-${p}`}>
                          <Tooltip title="Upload" placement="top">
                            <IconButton color="primary">
                              <CloudUploadIcon />
                            </IconButton>
                          </Tooltip>
                        </label>
                        <Tooltip title="Export" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => this.handleStarExport(p)}
                          >
                            <CloudDownloadIcon />
                          </IconButton>
                        </Tooltip>
                        {category.categoryInfo.pinned ? (
                          <Tooltip title="Unpin" placement="top">
                            <IconButton
                              color="primary"
                              onClick={() => this.handlePin(p, false)}
                            >
                              <RoomIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Pin" placement="top">
                            <IconButton
                              color="primary"
                              onClick={() => this.handlePin(p, true)}
                            >
                              <RoomOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="carousel__items">
                    {category.children.length
                      ? category.children.map((item) => (
                          <div>
                            <figure
                              className="carousel__item__figure"
                              key={guid()}
                            >
                              <Link to={`/view/${item.id}`} key={guid()}>
                                <img
                                  src={
                                    item.posterPath ||
                                    `${server}/api/v1/image/poster?text=${item.title}&extention=jpeg`
                                  }
                                  key={guid()}
                                  className="carousel__item__poster"
                                  alt={item.title}
                                />
                              </Link>
                              <Typography
                                className="carousel__item__title"
                                key={guid()}
                              >
                                {item.title}
                              </Typography>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  style={{ padding: "2px" }}
                                  onClick={() =>
                                    this.handleStar(item, category)
                                  }
                                >
                                  <StarIcon />
                                </IconButton>
                              </div>
                            </figure>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              ) : null
            )
          : null}
      </div>
    ) : (
      <div className="Carousel">
        {metadata.length
          ? metadata.map((category) =>
              category.children.length || !hide ? (
                <div className="carousel__category" key={guid()}>
                  <Link
                    to={
                      category.categoryInfo.type == "Starred"
                        ? "#"
                        : `/browse/${category.categoryInfo.name}`
                    }
                    key={guid()}
                    className="carousel__category__title no_decoration_link"
                  >
                    {category.categoryInfo.name}
                  </Link>
                  <div className="carousel__items">
                    {category.children.length
                      ? category.children.map((item) => (
                          <figure
                            className="carousel__item__figure"
                            key={guid()}
                          >
                            <Link to={`/view/${item.id}`} key={guid()}>
                              <img
                                src={
                                  item.posterPath ||
                                  `${server}/api/v1/image/poster?text=${item.title}&extention=jpeg`
                                }
                                key={guid()}
                                className="carousel__item__poster"
                                alt={item.title}
                              />
                            </Link>
                            <Typography
                              className="carousel__item__title"
                              key={guid()}
                            >
                              {item.title}
                            </Typography>
                          </figure>
                        ))
                      : null}
                  </div>
                </div>
              ) : null
            )
          : null}
      </div>
    );
  }
}
