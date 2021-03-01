import React from "react";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import "./Footer.css";

const styles = makeStyles((theme) => ({
  footer__container: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "75px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 90,
  },
}));

export default function Footer() {
  const classes = styles();

  const handleSelect = (event) => {
    sessionStorage.setItem("gallery", event.target.value);
    localStorage.setItem("gallery", event.target.value);
    window.location.reload();
  };
  let gallery =
    sessionStorage.getItem("gallery") || localStorage.getItem("gallery") || "carousel";

  return (
    <footer className={classes.footer__container}>
      <a href="https://github.com/libDrive/libDrive" target="_blank">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Font_Awesome_5_brands_github.svg/62px-Font_Awesome_5_brands_github.svg.png"
          className="footer__github"
          height="55px"
        />
      </a>
      <a
        className="no_decoration_link footer__text"
        href="https://eliasbenb.github.io"
        target="_blank"
      >
        © 2021 Copyright: Elias Benbourenane - v1.1.6
      </a>
      <div className="gallery__select">
        <FormControl className={classes.formControl}>
          <Select
            value={gallery}
            onChange={handleSelect}
            displayEmpty
            className={classes.selectEmpty}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={"carousel"}>Carousel</MenuItem>
            <MenuItem value={"tile"}>Tile</MenuItem>
          </Select>
        </FormControl>
      </div>
    </footer>
  );
}
