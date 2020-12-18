import React, { Component } from "react";

import { Typography } from "@material-ui/core";

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
              <div className="category">
                <a
                  href={`/browse/${category.name}`}
                  className="category__title no_decoration_link"
                >
                  {category.name}
                </a>
                <div className="items">
                  {category.children.length
                    ? category.children.map((item) => (
                        <figure className="item__figure">
                          <a href={`/view/${item.id}`}>
                            <img
                              src={item.posterPath}
                              className="item__poster"
                              alt={item.title}
                            />
                          </a>
                          <Typography className="item__title">
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
