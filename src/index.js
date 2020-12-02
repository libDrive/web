import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";
import "./index.css";

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <BrowserRouter>
      <Route exact path="/" component={App} />
    </BrowserRouter>
  </Router>,
  document.getElementById("root")
);
