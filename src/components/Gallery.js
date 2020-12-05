import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import "./Gallery.css";

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: {},
    };
  }

  componentDidMount() {
    fetch(
      `${this.state.server}/api/v1/metadata?a=${this.state.auth}&r=0:16&s=popularity-des`
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          metadata: data,
          isLoaded: true,
        })
      );
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
                          <Link to={`/browse/${item.id}`}>
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
                          <Link to={`/browse/${item.id}`}>
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
