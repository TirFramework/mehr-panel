import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { ConfigProvider, theme, Button } from "antd";

import Custom from "./pages/Custom";
import Login from "./layouts/Login";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPassword from "./pages/ForgotPassword";

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

  // Stamp a class on <body> so plain CSS/SCSS can target dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", !!isDarkMode.mode);
  }, [isDarkMode.mode]);

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
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route
                path="/:panelName/login"
                element={<Login />}
              />
                <Route
                path="/:panelName/forgot-password"
                element={<ForgotPassword />}
                />
            </Route>

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/:panelName/:pageModule/detail"
                element={<Custom type="detail" />}
              />
              <Route
                path="/:panelName/:pageModule/create-edit"
                element={<Custom type="create" />}
              />
                <Route
                path="/:panelName/:pageModule"
                element={<Custom type="index" />}
                />
            </Route>

            {/* 404 Route - باید در آخر باشد */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>


        </BrowserRouter>
      </EditingProvider>
    </ConfigProvider>
  );
}

export default MyApp;
