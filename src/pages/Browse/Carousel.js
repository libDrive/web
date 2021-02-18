import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Typography } from "@material-ui/core";

import { uuid } from "../../components";
import "./Carousel.css";

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: this.props.metadata,
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
    };
  }

  render() {
    let { metadata, server } = this.state;

    return (
      <div className="Carousel">
        {metadata.length
          ? metadata.map((category) => (
              <div className="carousel__category" key={uuid()}>
                <Link
                  to={`/browse/${category.categoryInfo.name}`}
                  key={uuid()}
                  className="carousel__category__title no_decoration_link"
                >
                  {category.categoryInfo.name}
                </Link>
                <div className="carousel__items">
                  {category.children.length
                    ? category.children.map((item) => (
                        <figure className="carousel__item__figure" key={uuid()}>
                          <Link to={`/view/${item.id}`} key={uuid()}>
                            <img
                              src={
                                item.posterPath ||
                                `${server}/api/v1/image/poster/${item.title}.jpeg`
                              }
                              key={uuid()}
                              className="carousel__item__poster"
                              alt={item.title}
                            />
                          </Link>
                          <Typography className="carousel__item__title" key={uuid()}>
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
