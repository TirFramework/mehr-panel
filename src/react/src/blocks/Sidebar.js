import React, {
  //useEffect,
  useState,
} from "react";
import { Layout, Menu } from "antd";

import { Link } from "react-router-dom";

import { useSidebar } from "../hooks";

import { PieChartOutlined, DesktopOutlined, UserOutlined } from '@ant-design/icons';

// import Icon from "../components/Icon";
// import SubMenu from "antd/lib/menu/SubMenu";

// import * as api from "../api";

const { Sider } = Layout;
// const { SubMenu } = Menu;

function App() {
  const [current, setCurrent] = useState();
  // const [menus, setMenus] = useState();
  // const [loading, setLoading] = useState(true);

  // console.log("🚀 sidebar");

  // const getMenus = () => {
  //   // const data = useSidebar();
  //   console.log("🚀 ~ file: Sidebar.js ~ line 38 ~ getMenus ~ getMenus");

  //   api
  //     .getSidebar()
  //     .then((res) => {
  //       console.log("🚀 ~ file: Index.js ~ line 69 ~ .then ~ res", res);

  //       setMenus(res.data)
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(
  //         "🚀 ~ file: Sidebar.js ~ line 38 ~ api.getSidebar ~ err",
  //         err
  //       );
  //     });
  // };

  // makeSidebar();

  // useEffect(() => {
  //   async function makeSidebar() {
  //     await getMenus();
  //   }
  //   makeSidebar();
  // }, []);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  // const { data: menus, isLoading } = useSidebar();

  // if (isLoading) return <p>loading...</p>;

  // if (loading) return <p>loading...</p>;

  return (
    <Sider className="overflow-auto h-screen fixed left-0">
      <div className="logo text-xl text-white p-4 bg-black">ADMIN PANEL</div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["0"]}
        onClick={handleClick}
        selectedKeys={[current]}
        mode="inline"
      >
        <Menu.Item key="Dashboard" icon={<DesktopOutlined />}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="User" icon={<DesktopOutlined />}>
          <Link to="/admin/user">User</Link>
        </Menu.Item>
        <Menu.Item key="Post" icon={<DesktopOutlined />}>
          <Link to="/admin/post">Post</Link>
        </Menu.Item>
        <Menu.Item key="PostCategory" icon={<DesktopOutlined />}>
          <Link to="/admin/postCategory">Post Category</Link>
        </Menu.Item>
        <Menu.Item key="Service" icon={<DesktopOutlined />}>
          <Link to="/admin/service">Service</Link>
        </Menu.Item>
        <Menu.Item key="ServiceCategory" icon={<DesktopOutlined />}>
          <Link to="/admin/serviceCategory">Service Category</Link>
        </Menu.Item>
        <Menu.Item key="Message" icon={<DesktopOutlined />}>
          <Link to="/admin/message">Message</Link>
        </Menu.Item>
        <Menu.Item key="Testimonial" icon={<DesktopOutlined />}>
          <Link to="/admin/testimonial">Testimonial</Link>
        </Menu.Item>
        <Menu.Item key="Newsletter" icon={<DesktopOutlined />}>
          <Link to="/admin/newsletter">Newsletter</Link>
        </Menu.Item>
        <Menu.Item key="Slider" icon={<DesktopOutlined />}>
          <Link to="/admin/slider">Slider</Link>
        </Menu.Item>
        <Menu.Item key="GeneralSetting" icon={<DesktopOutlined />}>
          <Link to="/admin/generalSetting/1/edit">General Setting</Link>
        </Menu.Item>
        <Menu.Item key="ContactSetting" icon={<DesktopOutlined />}>
          <Link to="/admin/contactSetting/1/edit">Contact Setting</Link>
        </Menu.Item>
        <Menu.Item key="HomeSetting" icon={<DesktopOutlined />}>
          <Link to="/admin/homeSetting/1/edit">Home Setting</Link>
        </Menu.Item>

        {/* {menus?.data.map((menu, index) => (
          <Menu.Item key={index} icon={<Icon type={menu.icon} />}>
            <Link to={menu.link}>{menu.title}</Link>
          </Menu.Item>
        ))} */}
      </Menu>
    </Sider>
  );
}

export default App;
