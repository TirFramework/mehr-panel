import Custom from './pages/Custom.js';
import Index from './pages/Index';
import Create from './pages/Create';


const dashboardRoutes = [
  {
    path: "/custom/:pageModule",
    name: "custom",
    component: Custom,
    layout: "/admin",
  },
  {
    path: "/:pageModule/:pageId/:pageType",
    name: "Edit",
    component: Create,
    layout: "/admin",
  },
  {
    path: "/:pageModule/:pageType",
    name: "Create",
    component: Create,
    layout: "/admin",
  },
  {
    path: "/:pageModule",
    name: "Index",
    component: Index,
    layout: "/admin",
  }

];

export default dashboardRoutes;
