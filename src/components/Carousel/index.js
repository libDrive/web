import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Button, Divider, IconButton, Typography } from "@material-ui/core";
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
        sessionStorage.getItem("server") ||
        localStorage.getItem("server") ||
        window.location.origin,
    };
    this.handleStar = this.handleStar.bind(this);
    this.handleStarRest = this.handleStarRest.bind(this);
    this.handleStarImport = this.handleStarImport.bind(this);
    this.handleStarExport = this.handleStarExport.bind(this);
  }

  handleStar(item, category) {
    let { metadata } = this.state;
    let starred_list = JSON.parse(localStorage.getItem("starred_list") || "[]");

    try {
      let index = starred_list.findIndex((i) => i.id == item.id);
      let index2 = category.children.findIndex((i) => i.id == item.id);
      let index3 = metadata.findIndex((i) => i.id == category.id);
      starred_list.splice(index, 1);
      category.children.splice(index2, 1);
      metadata[index3] = category;
      localStorage.setItem("starred_list", JSON.stringify(starred_list));
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
          localStorage.setItem("starred_list", "[]");
          location.reload();
        }
      });
    }

    this.setState({ metadata: metadata });
  }

  handleStarRest() {
    let { metadata } = this.state;

    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to reset your starred list?",
      icon: "warning",
      confirmButtonText: "Reset",
      confirmButtonColor: theme.palette.success.main,
      cancelButtonText: "No",
      cancelButtonColor: theme.palette.error.main,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("starred_list", "[]");
        if (metadata.length && metadata[0].type == "Starred") {
          metadata.splice(0, 1);
        }
        this.setState({ metadata: metadata });
      }
    });
  }

  handleStarImport(evt) {
    if (evt.target.files.length) {
      let { metadata } = this.state;
      var file = evt.target.files[0];
      var reader = new FileReader();
      reader.onload = (evt) => {
        localStorage.setItem("starred_list", evt.target.result);
        if (metadata.length && metadata[0].type == "Starred") {
          metadata[0].children = JSON.parse(evt.target.result);
          console.log(metadata[0]);
          this.setState({
            metadata: metadata,
          });
        }
      };
      reader.readAsText(file);
    }
  }

  handleStarExport() {
    let starred_list = localStorage.getItem("starred_list") || "[]";

    const file = new Blob([starred_list], { type: "application/json" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = `libdrive-starred-${+new Date()}.json`;
    link.click();
  }

  render() {
    let { hide, metadata, server } = this.state;

    return (
      <div className="Carousel">
        {metadata.length
          ? metadata.map((category) =>
              (category.children.length || !hide) &&
              (category.type != "Starred" || category.children.length) ? (
                <div className="carousel__category" key={guid()}>
                  {category.type == "Starred" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        to={"#"}
                        className="carousel__category__title no_decoration_link"
                      >
                        {category.categoryInfo.name}
                      </Link>
                      <div style={{ width: "100%" }}>
                        <div style={{ float: "left" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={this.handleStarRest}
                            style={{ marginLeft: "10px" }}
                          >
                            Reset
                          </Button>
                        </div>
                        <div style={{ float: "right" }}>
                          <input
                            id="file-input"
                            hidden
                            onChange={this.handleStarImport}
                            type="file"
                          />
                          <label htmlFor="file-input">
                            <Button
                              variant="outlined"
                              color="primary"
                              component="span"
                              size="small"
                              style={{ marginRight: "10px" }}
                            >
                              Import
                            </Button>
                          </label>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={this.handleStarExport}
                            size="small"
                            style={{ marginRight: "10px" }}
                          >
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={`/browse/${category.categoryInfo.name}`}
                      key={guid()}
                      className="carousel__category__title no_decoration_link"
                    >
                      {category.categoryInfo.name}
                    </Link>
                  )}
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
                            {category.type == "Starred" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    this.handleStar(item, category)
                                  }
                                >
                                  <StarIcon />
                                </IconButton>
                              </div>
                            ) : null}
                          </figure>
                        ))
                      : null}
                  </div>
                  {category.type == "Starred" ? (
                    <div>
                      <Divider />
                    </div>
                  ) : null}
                </div>
              ) : null
            )
          : null}
      </div>
    );
  }
}
