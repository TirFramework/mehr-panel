import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

import { Avatar, Dropdown, Form, Input, Layout, Menu, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { useHistory } from "react-router-dom";

import routes from "../routes.js";

import Sidebar from "../blocks/Sidebar";

const { Header, Content } = Layout;
const { Search } = Input;

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
    <Redirect from="/admin" to="/admin/dashboard" />
  </Switch>
);

function DefaultLayout(props) {
  console.log("🚀 layout");
  let history = useHistory();

  const logout = () => {
    Cookies.remove("api_token");
    history.push("/login");
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
          <Header className="bg-white px-4">
            <Row
              justify="space-between"
              align="middle"
              className="text-right flex justify-between"
            >
              <Form>
                <Form.Item label="site" name="search" className="my-auto">
                  <Search placeholder="input" style={{ width: 400 }} />
                </Form.Item>
              </Form>
              <Dropdown overlay={menu} trigger={["click"]}>
                <span
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <Avatar className="mr-2">U</Avatar>
                  Click me <DownOutlined />
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
