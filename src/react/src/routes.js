import Custom from "./pages/Custom.js";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Detail from "./pages/Detail";
import Login from "./layouts/Login.js";

export const dashboardRoutes = [
  {
    path: "/admin/overwrite-index/:pageModule",
    component: <Custom />,
  },
  {
    path: "/admin/c/:pageModule/create-edit",
    component: <Custom />,
  },
  {
    path: "/admin/custom/:pageModule",
    component: <Custom />,
  },
  {
    path: "/admin/:pageModule/detail",
    component: <Detail />,
  },
  {
    path: "/admin/:pageModule/create-edit",
    component: <Create />,
  },
  {
    path: "/admin/:pageModule",
    component: <Index />,
  },
];
export const authRoutes = [
  {
    path: "/admin/login",
    component: <Login />,
  },
];
