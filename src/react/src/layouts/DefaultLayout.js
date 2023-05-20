import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { Layout } from "antd";

import routes from "../routes.js";

import Sidebar from "../blocks/Sidebar";
import TopHeader from "../blocks/TopHeader.js";
import * as api from "../api";

const { Content } = Layout;


const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/custom/dashboard" />
  </Switch>
);

function DefaultLayout(props) {

const [general, setGeneral] = useState();
// const [loading, setLoading] = useState(true);


const makeGeneral = () => {
    return api
        .getGeneral()
        .then((res) => {
            setGeneral(res);
            // setLoading(false);
        })
        .catch((err) => {});
};

    useEffect(() => {
        async function makeHeader() {
            await makeGeneral();
        }
        makeHeader();
    }, []);

    return (
    <div className="flex">
      <Sidebar name={general?.name}/>
      <Layout className="site-layout">
        <div className="flex flex-col h-screen">
          <TopHeader username={general?.username}/>
          <Content className="overflow-scroll p-4">{switchRoutes}</Content>
          {/* <Footer/> */}
        </div>
      </Layout>
    </div>
  );
}

export default DefaultLayout;
