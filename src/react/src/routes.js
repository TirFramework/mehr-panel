import Dashboard from './pages/Dashboard.js';
import Index from './pages/Index';
import Create from './pages/Create';


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
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
