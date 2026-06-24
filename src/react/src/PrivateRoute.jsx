import React, { useEffect, useState } from "react";
import { getApiToken, API_TOKEN_CHANGED } from "./lib/authToken";
import { Outlet, useNavigate } from "react-router-dom";

import DefaultLayout from "./layouts/DefaultLayout";
import { isWindowSupported, onMessageListener } from "./lib/firebase";
import Config from "./constants/config";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => getApiToken());

  useEffect(() => {
    const syncAuth = () => setAuth(getApiToken());
    window.addEventListener(API_TOKEN_CHANGED, syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener(API_TOKEN_CHANGED, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const supported = await isWindowSupported();
      if (supported) {
        onMessageListener().catch(() => {});
      }
    })();
  }, []);

  useEffect(() => {
    if (!auth) {
      navigate(`/${Config.prefix}/login?path=${window.location.pathname}`);
    }
  }, [auth, navigate]);

  if (!auth) {
    return null;
  }

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default PrivateRoute;
