import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Divider, IconButton, Typography } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";

import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.css";

import { guid } from "../../components";
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
      starred_list: JSON.parse(localStorage.getItem("starred_list") || "[]"),
    };
    this.handleStar = this.handleStar.bind(this);
  }

  handleStar(item, category) {
    let { metadata, starred_list } = this.state;

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

    this.setState({ metadata: metadata, starred_list: starred_list });
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
                  <Link
                    to={
                      category.type != "Starred"
                        ? `/browse/${category.categoryInfo.name}`
                        : "#"
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
                  {category.type == "Starred" ? (<div><Divider /></div>) : (null)}
                </div>
              ) : null
            )
          : null}
      </div>
    );
  }
}
