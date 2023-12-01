import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import reportWebVitals from "./reportWebVitals";

import PrivateRoute from "./PrivateRoute.js";

// core components
import DefaultLayout from "./layouts/DefaultLayout.js";
import Login from "./layouts/Login.js";

import "./assets/tailwindbasic.css";
import "antd/dist/antd.min.css"; // or 'antd/dist/antd.less'
import "./assets/index.css";
import dashboardRoutes from "./routes.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
      retry: false,
      refetchOnWindowFocus: false,
      // when upload window opens the webiste loses focus and therefore when upload window closess
      // some of the queries will refetch and app flow will be ruined !!!
      onError: (err) => {
        console.log("🚀 ~ file: index.js:29 ~ err:", err);
      },
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route
          path={"/admin/login"}
          element={<Login />}
          key={`Login`}
          title={`Login`}
        />
        <Route element={<PrivateRoute />}>
          {dashboardRoutes.map((privateAuthRoute, index) => (
            <Route
              path={privateAuthRoute.path}
              element={privateAuthRoute.component}
              key={`${privateAuthRoute.path}-${index}`}
              title={`${privateAuthRoute.path}-${index}`}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
