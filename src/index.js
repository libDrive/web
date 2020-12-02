import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";
import Browse from "./components/Browse";
import Login from "./components/Login";
import "./index.css";

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <BrowserRouter>
      <Route exact path="/" component={App} />
      <Route exact path="/browse" component={Browse} />
      <Route exact path="/login" component={Login} />
    </BrowserRouter>
  </Router>,
  document.getElementById("root")
);
