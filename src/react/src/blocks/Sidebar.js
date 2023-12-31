import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { useSidebar } from "../Request";
import useLocalStorage from "../hooks/useLocalStorage";

const { Sider } = Layout;

function App(props) {
  const { data: menus, ...menusQuery } = useSidebar();
  const [isCollapsible, setIsCollapsible] = useLocalStorage("collapsible", {
    status: false,
  });

  const { pageModule } = useParams();

  const openKeys = (menus) => {
    let r = [];
    menus.forEach((item) => {
      if (item.children) {
        item.children.forEach((element) => {
          if (element.name === pageModule) {
            r.push(item.name);
          }
        });
      }
    });
    return r;
  };

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
            selectedKeys={pageModule}
            defaultOpenKeys={openKeys(menus)}
            mode="inline"
            items={menus.map(({ link, icon, title, name, children = [] }) => ({
              icon: <Icon type={icon} />,
              key: name,
              label: (
                <>
                  {children.length === 0 ? (
                    <Link className="menu__link" to={link}>
                      {title}
                    </Link>
                  ) : (
                    <span className="menu__parent">{title}</span>
                  )}
                </>
              ),
              children:
                children.length === 0
                  ? null
                  : children.map(({ link, icon, title, name }) => ({
                      icon: <Icon type={icon} />,
                      key: name,
                      label: (
                        <Link className="menu__link" to={link}>
                          {title}
                        </Link>
                      ),
                    })),
            }))}
          />
        </>
      )}
    </Sider>
  );
}

export default App;
