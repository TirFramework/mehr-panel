import Cookies from "js-cookie";
import { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PublicRoute = ({ component, ...rest }) => {
  const navigate = useNavigate();
  let auth = Cookies.get("api_token");

  useEffect(() => {
    if (auth) {
      return navigate(`/admin/custom/dashboard`);
    }
  }, [auth]);

  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
