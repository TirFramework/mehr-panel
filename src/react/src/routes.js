import Custom from "./pages/Custom.js";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Detail from "./pages/Detail";

const dashboardRoutes = [
    {
        path: "/overwrite-index/:pageModule",
        name: "custom",
        component: Custom,
        layout: "/admin",
    },
    {
        path: "/c/:pageModule/create-edit",
        name: "custom",
        component: Custom,
        layout: "/admin",
    },
    {
        path: "/custom/:pageModule",
        name: "custom",
        component: Custom,
        layout: "/admin",
    },
    {
        path: "/:pageModule/detail",
        name: "Detail",
        component: Detail,
        layout: "/admin",
    },
    {
        path: "/:pageModule/create-edit",
        name: "Create",
        component: Create,
        layout: "/admin",
    },
    {
        path: "/:pageModule",
        name: "Index",
        component: Index,
        layout: "/admin",
    },
];

export default dashboardRoutes;
