import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { dashboardRoutes, authRoutes } from "./routes";
import { ConfigProvider, theme, Button } from "antd";

// core components
import { BulbOutlined, BulbFilled } from "@ant-design/icons";

// import reportWebVitals from "./reportWebVitals";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import useLocalStorage from "./hooks/useLocalStorage";
import { EditingProvider } from "./context/EditingContext";
const { defaultAlgorithm, darkAlgorithm } = theme;

function MyApp() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("mode", { mode: false });

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode.mode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <EditingProvider>
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
      </EditingProvider>
    </ConfigProvider>
  );
}

export default MyApp;
