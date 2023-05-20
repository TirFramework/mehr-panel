import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

import * as api from "../api";

const { Sider } = Layout;
// const { SubMenu } = Menu;

function App(props) {
  const [current, setCurrent] = useState();
  const [menus, setMenus] = useState();
  const [general, setGeneral] = useState();
  const [loading, setLoading] = useState(true);


  const getMenus = () => {
    return api
      .getSidebar()
      .then((res) => {
        setMenus(res);
        setLoading(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    async function makeSidebar() {
      await getMenus();
    }
    makeSidebar();
  }, []);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Sider collapsible>
      {loading ? (
        <>loading ....</>
      ) : (
        <>
          <div className="logo text-xl text-white p-4 bg-black">
            {props?.name}
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
