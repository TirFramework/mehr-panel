import React, { useEffect, useState } from "react";
import { Badge, Layout, Menu } from "antd";
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
            className="menu__sidebar"
            defaultSelectedKeys={["0"]}
            selectedKeys={pageModule}
            defaultOpenKeys={openKeys(menus)}
            mode="inline"
            items={menus.map(
              ({ link, icon, title, name, badge, children = [] }) => ({
                icon: icon ? <Icon type={icon} /> : null,
                key: name,
                label: (
                  <>
                    {children.length === 0 ? (
                      <Link className="menu__link" to={link}>
                        {title}{" "}
                        {badge > 0 && <Badge count={badge} size="small" />}
                      </Link>
                    ) : (
                      <span className="menu__parent">{title}</span>
                    )}
                  </>
                ),
                children:
                  children.length === 0
                    ? null
                    : children.map(({ link, icon, title, name, badge }) => ({
                        icon: icon ? <Icon type={icon} /> : null,
                        key: name,
                        label: (
                          <Link className="menu__link" to={link}>
                            {title}{" "}
                            {badge > 0 && <Badge count={badge} size="small" />}
                          </Link>
                        ),
                      })),
              })
            )}
          />
        </>
      )}
    </Sider>
  );
}

export default App;
