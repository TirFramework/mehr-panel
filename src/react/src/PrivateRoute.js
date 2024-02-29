import Cookies from "js-cookie";
import { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import {
  fetchToken,
  isWindowSupported,
  onMessageListener,
} from "./lib/firebase";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component, ...rest }) => {
  const navigate = useNavigate();
  let auth = Cookies.get("api_token");

  useEffect(() => {
    (async () => {
      const arr = await isWindowSupported();
      // console.log("🚀 ~ file: PrivateRoute.js:48 ~ issssssssssssss:", arr);
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
