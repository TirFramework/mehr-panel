import React, { useState } from "react";
import { Layout, Menu } from "antd";

import { Link } from "react-router-dom";
import { useSidebar } from "../hooks";

import Icon from "../components/Icon";

const { Sider } = Layout;
const { SubMenu } = Menu;

function App() {
  const [current, setCurrent] = useState();

  console.log("🚀 sidebar");

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const { data: menus, isLoading } = useSidebar();

  if (isLoading) return <p>loading...</p>;

  return (
    <Sider className="overflow-auto h-screen fixed left-0">
      <div className="logo text-xl text-white p-4 bg-black">AMAJGROUP</div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["0"]}
        onClick={handleClick}
        selectedKeys={[current]}
        mode="inline"
      >
        {/* <Menu.Item key="Create" icon={<PieChartOutlined />}>
          <Link to="/admin/user/create">user Create</Link>
        </Menu.Item>
        <Menu.Item key="Dashboard" icon={<DesktopOutlined />}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="index" icon={<DesktopOutlined />}>
          <Link to="/admin/user">user index</Link>
        </Menu.Item> */}
        {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu> */}

        {menus.data.map((menu, index) => (
          <Menu.Item key={index} icon={<Icon type={menu.icon} />}>
            <Link to={menu.link}>{menu.title}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default App;
