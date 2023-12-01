import Cookies from "js-cookie";
import { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component, ...rest }) => {
  const navigate = useNavigate();
  let auth = Cookies.get("api_token");

  useEffect(() => {
    // console.log("🚀 ~ file: PrivateRoute.js:39 ~ useEffect ~ useEffect:");
    if (!auth) {
      return navigate(`/admin/login?path=${window.location.pathname}`);
    }
  }, [auth]);

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default PrivateRoute;
