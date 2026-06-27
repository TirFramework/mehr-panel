import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App, ConfigProvider, theme, Button } from "antd";

import Custom from "./pages/Custom";
import DynamicPublicPage from "./pages/DynamicPublicPage";
import DefaultLogin from "./layouts/Login";
import NotFoundPage from "./pages/NotFoundPage";
import DefaultForgotPassword from "./pages/ForgotPassword";

// core components
import { BulbOutlined, BulbFilled } from "@ant-design/icons";

// import reportWebVitals from "./reportWebVitals";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import useLocalStorage from "./hooks/useLocalStorage";
import { EditingProvider } from "./context/EditingContext";
import { useLanguage } from "./context/LanguageContext";
import { setNotificationApi } from "./lib/notificationService";
const { defaultAlgorithm, darkAlgorithm } = theme;

const fontFamily =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const sharedTheme = {
  token: {
    colorPrimary: "#6366f1",
    colorInfo: "#6366f1",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily,
    controlHeight: 38,
    wireframe: false,
    motionDurationMid: "0.2s",
  },
  components: {
    Button: {
      primaryShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
      fontWeight: 500,
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBorderRadius: 10,
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemMarginBlock: 4,
    },
    Input: {
      activeShadow: "0 0 0 2px rgba(99, 102, 241, 0.12)",
    },
    Layout: {
      headerHeight: 64,
      siderBg: "#1e1b4b",
    },
  },
};

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

  // Stamp a class on <body> so plain CSS/SCSS can target dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", !!isDarkMode.mode);
  }, [isDarkMode.mode]);

  return (
    <ConfigProvider
      direction={dir}
      locale={antdLocale}
      theme={{
        ...sharedTheme,
        algorithm: isDarkMode.mode ? darkAlgorithm : defaultAlgorithm,
        token: {
          ...sharedTheme.token,
          ...(isDarkMode.mode
            ? { colorBgContainer: "#1e293b", colorBgLayout: "#0f172a" }
            : { colorBgContainer: "#ffffff", colorBgLayout: "#f1f5f9" }),
        },
        components: {
          ...sharedTheme.components,
          Layout: {
            ...sharedTheme.components.Layout,
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
            {/* Public Routes */}
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

            {/* 404 Route - must be last */}
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
