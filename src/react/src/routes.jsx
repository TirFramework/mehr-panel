import Custom from "./pages/Custom";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./layouts/Login";
import ForgotPassword from "./pages/ForgotPassword";

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
  {
    path: "*",
    component: <NotFoundPage />,
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

