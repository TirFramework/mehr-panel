import React, { useEffect } from "react";

import { getApiToken } from "./lib/authToken";

import { Outlet, useNavigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import Config from "./constants/config";



const PublicRoute = () => {

  const navigate = useNavigate();

  const auth = getApiToken();



  useEffect(() => {

    if (auth) {

      navigate(`/${Config.prefix}/dashboard`);

    }

  }, [auth, navigate]);



  return (

    <PublicLayout>

      <Outlet />

    </PublicLayout>

  );

};



export default PublicRoute;

