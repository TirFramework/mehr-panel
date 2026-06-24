import React, { useEffect } from "react";
import { getApiToken } from "./lib/authToken";
import { Outlet, useNavigate } from "react-router-dom";

import DefaultLayout from "./layouts/DefaultLayout";
import { isWindowSupported, onMessageListener } from "./lib/firebase";
import Config from "./constants/config";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component, ...rest }) => {
  const navigate = useNavigate();
  let auth = getApiToken();

  useEffect(() => {
    (async () => {
      const arr = await isWindowSupported();
      if (arr) {
        onMessageListener()
          .then((payload) => {
            console.log(
              "🚀 ~ file: PrivateRoute.js:50 ~ .then ~ payload:",
              payload
            );
          })
          .catch((err) => {
            console.log("🚀 ~ file: PrivateRoute.js:53 ~ err:", err);
          });
      } else {
        // console.log("🚀 ~ file: PrivateRoute.js:55 ~ setIsNotSupported: true");
        // setIsNotSupported(true);
      }
    })();
  }, []);
  useEffect(() => {
    if (!auth) {
      return navigate(
        `/${Config.perfix}/login?path=${window.location.pathname}`
      );
    }
  }, [auth, navigate]);

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default PrivateRoute;
