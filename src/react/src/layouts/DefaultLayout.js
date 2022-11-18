import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

import { Avatar, Dropdown, Layout, Menu, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { useHistory } from "react-router-dom";

import routes from "../routes.js";

import Sidebar from "../blocks/Sidebar";

const { Header, Content } = Layout;

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
  let history = useHistory();

  const logout = () => {
    Cookies.remove("api_token");
    history.push("/admin/login");
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>logout</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <div className="flex flex-col h-screen">
          <Header className="px-4">
            <Row
              justify="space-between"
              align="middle"
              className="text-right flex justify-between"
            >
              <div></div>
              <Dropdown overlay={menu} trigger={["click"]}>
                <span
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <Avatar>U</Avatar>
                  <span className="text-white mx-2">Profile</span>
                  <DownOutlined className="text-white" />
                </span>
              </Dropdown>
            </Row>
          </Header>
          <Content className="overflow-auto p-4">{switchRoutes}</Content>
          {/* <Footer/> */}
        </div>
      </Layout>
    </div>
  );
}

export default DefaultLayout;
