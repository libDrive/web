import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Typography } from "@material-ui/core";

import { guid } from "../../components";
import "./index.css";

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: this.props.metadata,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server") || window.location.origin,
    };
  }

  render() {
    let { metadata, server } = this.state;

    return (
      <div className="Carousel">
        {metadata.length
          ? metadata.map((category) => (
              <div className="carousel__category" key={guid()}>
                <Link
                  to={`/browse/${category.categoryInfo.name}`}
                  key={guid()}
                  className="carousel__category__title no_decoration_link"
                >
                  {category.categoryInfo.name}
                </Link>
                <div className="carousel__items">
                  {category.children.length
                    ? category.children.map((item) => (
                        <figure className="carousel__item__figure" key={guid()}>
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
            ))
          : null}
      </div>
    );
  }
}
