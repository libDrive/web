import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

import "./Gallery.css";

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      metadata: this.props.metadata,
    };
  }

  render() {
    let { metadata } = this.state;
    return this.state.isLoaded ? (
      <div className="Gallery">
        {metadata.length
          ? metadata.map((category) => (
              <div className="category">
                <Link
                  to={`/browse/${category.name}`}
                  className="category__title no_decoration_link"
                >
                  {category.name}
                </Link>
                <div className="items">
                  {category.files.length
                    ? category.files.map((item) => (
                        <figure className="item__figure">
                          <Link to={`/view/${item.id}`}>
                            <img
                              src={item.posterPath}
                              className="item__poster"
                              alt={item.title}
                            />
                          </Link>
                          <Typography className="item__title">
                            {item.title}
                          </Typography>
                        </figure>
                      ))
                    : null}
                  {category.folders.length
                    ? category.folders.map((item) => (
                        <figure className="item__figure">
                          <Link to={`/view/${item.id}`}>
                            <img
                              src={item.posterPath}
                              className="item__poster"
                              alt={item.title}
                            />
                          </Link>
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
    ) : (
      <div></div>
    );
  }
}
