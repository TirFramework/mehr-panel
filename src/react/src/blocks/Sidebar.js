import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useSidebar } from "../Request";
import useLocalStorage from "../hooks/useLocalStorage";

const { Sider } = Layout;

function App(props) {
  const { data: menus, ...menusQuery } = useSidebar();
  const [isCollapsible, setIsCollapsible] = useLocalStorage("collapsible", {
    status: false,
  });

  return (
    <Sider
      collapsible
      collapsed={isCollapsible.status}
      onCollapse={(value) =>
        setIsCollapsible({
          status: value,
        })
      }
    >
      {menusQuery.isLoading ? (
        <>loading ....</>
      ) : (
        <>
          <Menu
            theme="dark"
            defaultSelectedKeys={["0"]}
            selectedKeys={window.location.pathname}
            mode="inline"
            items={menus.map(({ link, icon, title }) => ({
              icon: <Icon type={icon} />,
              key: link,
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
