import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";

import { Link } from "react-router-dom";

// import { useSidebar } from "../hooks";

// import { PieChartOutlined, DesktopOutlined, UserOutlined } from '@ant-design/icons';

import Icon from "../components/Icon";
// import SubMenu from "antd/lib/menu/SubMenu";

import * as api from "../api";

const { Sider } = Layout;
// const { SubMenu } = Menu;

function App() {
  const [current, setCurrent] = useState();
  const [menus, setMenus] = useState();
  const [general, setGeneral] = useState();
  const [loading, setLoading] = useState(true);

  // console.log("🚀 sidebar");

  const makeGeneral = () => {
    return api
      .getGeneral()
      .then((res) => {
        setGeneral(res);
        setLoading(false);
      })
      .catch((err) => {});
  };

  const getMenus = () => {
    // const data = useSidebar();
    return api
      .getSidebar()
      .then((res) => {
        setMenus(res);
        setLoading(false);
      })
      .catch((err) => {});
  };

  // makeSidebar();

  useEffect(() => {
    async function makeSidebar() {
      await getMenus();
      await makeGeneral();
    }
    makeSidebar();
  }, []);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Sider
      className="overflow-auto h-screen fixed left-0"
      style={{ position: "fixed" }}
    >
      {loading ? (
        <>loading ....</>
      ) : (
        <>
          <div className="logo text-xl text-white p-4 bg-black">
            {general?.name}
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={["0"]}
            onClick={handleClick}
            selectedKeys={[current]}
            mode="inline"
            items={menus.map(({ link, icon, title }) => ({
              icon: <Icon type={icon} />,
              label: (
                <Link className="ml-2" to={link}>
                  {title}
                </Link>
              ),
            }))}
          />
        </>
      )}
    </Sider>
  );
}

export default App;
