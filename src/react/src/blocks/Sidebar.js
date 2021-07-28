import React, { useState } from 'react';
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";


import { Link } from "react-router-dom";


const { Sider } = Layout;
const { SubMenu } = Menu;


function App() {


  const [current, setCurrent] = useState();

  console.log("🚀 sidebar")
  const handleClick = (e) => {
    setCurrent(e.key);
  }


  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <div className="logo h-8 m-4 " />
      <Menu theme="dark" defaultSelectedKeys={["Dashboard"]} onClick={handleClick} selectedKeys={[current]} mode="inline">
        <Menu.Item key="Post" icon={<PieChartOutlined />}>
          <Link to="/post/index">Post</Link>
        </Menu.Item>
        <Menu.Item key="Create" icon={<PieChartOutlined />}>
          <Link to="/post/create">Post Create</Link>
        </Menu.Item>
        <Menu.Item key="Dashboard" icon={<DesktopOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />}>
          Files
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default App;
