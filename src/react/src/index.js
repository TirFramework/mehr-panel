import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

// import reportWebVitals from "./reportWebVitals";

import PrivateRoute from "./PrivateRoute.js";

// core components
import DefaultLayout from "./layouts/DefaultLayout.js";
import Login from "./layouts/Login.js";

import "./assets/index.less";

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Switch>
        <Route path="/admin/login" component={Login} />
        <PrivateRoute path="/admin" component={DefaultLayout} />
        {/* <Redirect from="/" to="/admin/login" /> */}
      </Switch>
    </BrowserRouter>
  </QueryClientProvider>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
