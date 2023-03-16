import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { Layout } from "antd";

import routes from "../routes.js";

import Sidebar from "../blocks/Sidebar";
import TopHeader from "../blocks/TopHeader.js";

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
  console.log("🚀 layout");

  return (
    <div>
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <div className="flex flex-col h-screen">
          <TopHeader />
          <Content className="overflow-scroll p-4">{switchRoutes}</Content>
          {/* <Footer/> */}
        </div>
      </Layout>
    </div>
  );
}

export default DefaultLayout;
