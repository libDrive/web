import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, withRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import App from "./App";
import theme from "./theme";
import { Browse, CategoryBrowse, Login, Logout, Profile, Search, Settings, View } from "./components";
import "./index.css";

const history = createBrowserHistory();
ReactDOM.render(
  <Router history={history}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Route exact path={"/"} component={withRouter(App)} />
        <Route exact path={"/browse"} component={withRouter(Browse)} />
        <Route exact path={"/browse/:category"} component={withRouter(CategoryBrowse)} />
        <Route exact path={"/login"} component={withRouter(Login)} />
        <Route exact path={"/logout"} component={withRouter(Logout)} />
        <Route exact path={"/profile"} component={withRouter(Profile)} />
        <Route exact path={"/search/:q"} component={withRouter(Search)} />
        <Route exact path={"/settings"} component={withRouter(Settings)} />
        <Route exact path={"/view/:id"} component={withRouter(View)} />
    </ThemeProvider>
  </Router>,
  document.getElementById("root")
);
