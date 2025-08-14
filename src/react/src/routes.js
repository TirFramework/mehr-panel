import Custom from "./pages/Custom.js";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Detail from "./pages/Detail";
import Login from "./layouts/Login.js";
import ForgotPassword from "./pages/ForgotPassword.js";

export const dashboardRoutes = [
  {
    path: "/:panelName/:pageModule/detail",
    component: <Custom type="detail" />,
  },
  {
    path: "/:panelName/:pageModule/create-edit",
    component: <Custom type="create" />,
  },
  {
    path: "/:panelName/:pageModule",
    component: <Custom type="index" />,
  },
];

export const authRoutes = [
  {
    path: "/:panelName/login",
    component: <Login />,
  },
  {
    path: "/:panelName/forgot-password",
    component: <ForgotPassword />,
  },
];
