import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Typography } from "@material-ui/core";

import { uuid } from "../../components";
import "./Tile.css";

export default class Tile extends Component {
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
      <div className="Tile">
        {metadata.length
          ? metadata.map((category) => (
              <div className="tile__category" key={uuid()}>
                <Link
                  to={`/browse/${category.categoryInfo.name}`}
                  key={uuid()}
                  className="tile__category__title no_decoration_link"
                >
                  {category.categoryInfo.name}
                </Link>
                <div className="tile__items">
                  {category.children.length
                    ? category.children.map((item) => (
                        <figure className="tile__item__figure" key={uuid()}>
                          <Link to={`/view/${item.id}`} key={uuid()}>
                            <img
                              src={
                                item.posterPath ||
                                `${server}/api/v1/image/poster?text=${item.title}&extention=jpeg`
                              }
                              key={uuid()}
                              className="tile__item__poster"
                              alt={item.title}
                            />
                          </Link>
                          <Typography
                            className="tile__item__title"
                            key={uuid()}
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
