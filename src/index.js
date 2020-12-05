import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import App from "./App";
import Browse from "./components/Browse";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import Search from "./components/Search";
import Settings from "./components/Settings";
import "./index.css";

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Route exact path="/" component={App} />
        <Route exact path="/browse" component={Browse} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/search/:q" component={Search} />
        <Route exact path="/settings" component={Settings} />
      </BrowserRouter>
    </ThemeProvider>
  </Router>,
  document.getElementById("root")
);
