import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App, ConfigProvider, theme, Button } from "antd";

import Custom from "./pages/Custom";
import DynamicPublicPage from "./pages/DynamicPublicPage";
import DefaultLogin from "./layouts/Login";
import NotFoundPage from "./pages/NotFoundPage";
import DefaultForgotPassword from "./pages/ForgotPassword";

import { BulbOutlined, BulbFilled } from "@ant-design/icons";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import useLocalStorage from "./hooks/useLocalStorage";
import { EditingProvider } from "./context/EditingContext";
import { useLanguage } from "./context/LanguageContext";
import { setNotificationApi } from "./lib/notificationService";
import sharedTheme from "./theme/default";
import mergeTheme from "./theme/mergeTheme";

const { defaultAlgorithm, darkAlgorithm } = theme;

const themeOverrideModules = import.meta.glob("./theme/override.js", {
  eager: true,
});
const themeOverride =
  themeOverrideModules["./theme/override.js"]?.default ?? {};
const baseTheme = mergeTheme(sharedTheme, themeOverride);

const NotificationInitializer = () => {
  const { notification } = App.useApp();

  useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);

  return null;
};

function MyApp() {
  const { dir, antdLocale } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useLocalStorage("mode", { mode: false });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", !!isDarkMode.mode);
  }, [isDarkMode.mode]);

  return (
    <ConfigProvider
      direction={dir}
      locale={antdLocale}
      theme={{
        ...baseTheme,
        algorithm: isDarkMode.mode ? darkAlgorithm : defaultAlgorithm,
        token: {
          ...baseTheme.token,
          ...(isDarkMode.mode
            ? { colorBgContainer: "#1e293b", colorBgLayout: "#0f172a" }
            : { colorBgContainer: "#ffffff", colorBgLayout: "#f1f5f9" }),
        },
        components: {
          ...baseTheme.components,
          Layout: {
            ...baseTheme.components?.Layout,
            siderBg: isDarkMode.mode ? "#12102e" : "#1e1b4b",
            bodyBg: isDarkMode.mode ? "#0f172a" : "#f1f5f9",
          },
        },
      }}
    >
      <App>
        <NotificationInitializer />
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
              <Route
                path="/:panelName/login"
                element={
                  <DynamicPublicPage
                    pageName="Login"
                    DefaultComponent={DefaultLogin}
                  />
                }
              />
              <Route
                path="/:panelName/forgot-password"
                element={
                  <DynamicPublicPage
                    pageName="ForgotPassword"
                    DefaultComponent={DefaultForgotPassword}
                  />
                }
              />
            </Route>

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
                path="/:panelName/:pageModule/list"
                element={<Custom type="list" />}
              />
              <Route
                path="/:panelName/:pageModule"
                element={<Custom type="index" />}
              />
            </Route>

            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>


        </BrowserRouter>
        </EditingProvider>
      </App>
    </ConfigProvider>
  );
}

export default MyApp;
