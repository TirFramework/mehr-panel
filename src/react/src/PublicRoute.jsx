import React, { useEffect } from "react";
import { getApiToken } from "./lib/authToken";
import { Outlet, useNavigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Config from "./constants/config";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PublicRoute = ({ component, ...rest }) => {
  const navigate = useNavigate();
  let auth = getApiToken();

  useEffect(() => {
    if (auth) {
      return navigate(`/${Config.perfix}/dashboard`);
    }
  }, [auth, navigate]);

  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
