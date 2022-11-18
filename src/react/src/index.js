import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// import reportWebVitals from "./reportWebVitals";

import PrivateRoute from "./PrivateRoute.js";

// core components
import DefaultLayout from "./layouts/DefaultLayout.js";
import Login from "./layouts/Login.js";

import "./assets/tailwindcss.css";
import "antd/dist/antd.min.css"; // or 'antd/dist/antd.less'
import "./assets/index.less";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin/login" component={Login} />
      <PrivateRoute path="/admin" component={DefaultLayout} />
      {/* <Redirect from="/" to="/admin/login" /> */}
    </Switch>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
