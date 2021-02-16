import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Typography } from "@material-ui/core";

import { uuid } from "../components";
import "./Gallery.css";

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: this.props.metadata,
    };
  }

  render() {
    let { metadata } = this.state;

    return (
      <div className="Gallery">
        {metadata.length
          ? metadata.map((category) => (
              <div className="category" key={uuid()}>
                <Link
                  to={`/browse/${category.categoryInfo.name}`}
                  key={uuid()}
                  className="category__title no_decoration_link"
                >
                  {category.categoryInfo.name}
                </Link>
                <div className="items">
                  {category.children.length
                    ? category.children.map((item) => (
                        <figure className="item__figure" key={uuid()}>
                          <Link to={`/view/${item.id}`} key={uuid()}>
                            <img
                              src={item.posterPath}
                              key={uuid()}
                              className="item__poster"
                              alt={item.title}
                            />
                          </Link>
                          <Typography className="item__title" key={uuid()}>
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
