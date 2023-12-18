import { BrowserRouter, Route, Routes } from "react-router-dom";
import { dashboardRoutes, authRoutes } from "./routes.js";
import { ConfigProvider, theme, Button, Card } from "antd";

// import reportWebVitals from "./reportWebVitals";

import PrivateRoute from "./PrivateRoute.js";
import PublicRoute from "./PublicRoute.js";

// core components
import DefaultLayout from "./layouts/DefaultLayout.js";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";

import Login from "./layouts/Login.js";

import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage.js";
const { defaultAlgorithm, darkAlgorithm } = theme;

function MyApp() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("mode", { mode: false });

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode.mode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Button
          type="link"
          size="large"
          className="toggle-theme"
          onClick={() => {
            setIsDarkMode({
              mode: !isDarkMode.mode,
            });
          }}
          icon={isDarkMode.mode ? <BulbOutlined /> : <BulbFilled />}
        />
        <Routes>
          <Route element={<PublicRoute />}>
            {authRoutes.map((authRoute, index) => (
              <Route
                path={authRoute.path}
                element={authRoute.component}
                key={`${authRoute.path}-${index}`}
                title={`${authRoute.path}-${index}`}
              />
            ))}
          </Route>
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
    </ConfigProvider>
  );
}

export default MyApp;
