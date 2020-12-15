import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";

import { Nav } from "../components";
import "./View.css";

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server:
        sessionStorage.getItem("server") || localStorage.getItem("server"),
      auth: sessionStorage.getItem("auth") || localStorage.getItem("auth"),
      isLoaded: false,
      metadata: {},
      id: this.props.match.params.id,
    };
  }

  componentDidMount() {
    let { auth, id, server } = this.state;

    fetch(`${server}/api/v1/metadata?a=${auth}&id=${id}`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          metadata: data,
          isLoaded: true,
        })
      );
  }

  render() {
    let { auth, id, isLoaded, metadata, server } = this.state;

    return isLoaded ? (
      <div className="View">
        <Nav />
        <div className="plyr__component">
          <Plyr
            source={{
              type: "video",
              sources: [
                {
                  src: `${server}/api/v1/download?a=${auth}&id=${id}`,
                },
              ],
            }}
          />
        </div>
        <div className="info__container">
          <div className="info__left">
            <img className="info__poster" src={metadata.posterPath} />
          </div>
          <div className="info__right">
            <Typography variant="h2" className="info__title">{metadata.title}</Typography>
            <Typography variant="body1" className="info__overview" style={{ marginTop: "30px" }}>
              {metadata.overview}
            </Typography>
            <ViewMenu props={this.state} />
          </div>
        </div>
      </div>
    ) : (
      <div className="Loading">
      </div>
    );
  }
}


export function ViewMenu(props) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  let { auth, id, isLoaded, metadata, server } = props.props;

  return (
    <div className="ViewMenu" style={{ marginTop: "30px" }}>
      <Button
        aria-controls="view-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="primary"
      >
        External Player
      </Button>
      <Menu
        id="view-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        <a
          href={`vlc://${server}/api/v1/download?a=${auth}&id=${id}`}
          className="no_decoration_link"
        >
          <MenuItem onClick={handleClose}>VLC</MenuItem>
        </a>
        <a
          href={`potplayer://${server}/api/v1/download?a=${auth}&id=${id}`}
          className="no_decoration_link"
        >
          <MenuItem onClick={handleClose}>PotPlayer</MenuItem>
        </a>
      </Menu>
    </div>
  );
}
