import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useSidebar } from "../Request";

const { Sider } = Layout;

function App(props) {
  const { data: menus, ...menusQuery } = useSidebar();

  return (
    <Sider collapsible>
      {menusQuery.isLoading ? (
        <>loading ....</>
      ) : (
        <>
          <div className="logo text-xl text-white p-4 bg-black">
            {props?.name}
          </div>
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
