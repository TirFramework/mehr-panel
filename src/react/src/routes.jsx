import React from "react";
import Custom from "./pages/Custom";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./layouts/Login";
import ForgotPassword from "./pages/ForgotPassword";

export const dashboardRoutes = [
  {
    path: "/:panelName/:pageModule/detail",
    Component: <Custom type="detail" />,
  },
  {
    path: "/:panelName/:pageModule/create-edit",
    Component: <Custom type="create" />,
  },
  {
    path: "/:panelName/:pageModule",
    Component: <Custom type="index" />,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
];

export const authRoutes = [
  {
    path: "/:panelName/login",
    Component: Login,
  },
  {
    path: "/:panelName/forgot-password",
    Component: ForgotPassword,
  },
];

