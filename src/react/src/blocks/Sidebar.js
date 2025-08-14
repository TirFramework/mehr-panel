import React, { useMemo } from "react";
import { Badge, Layout, Menu, Tooltip } from "antd";
import { Link, useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const findActiveKeys = (
    items,
    currentPath,
    currentPageModule,
    parentKeys = []
  ) => {
    let activeKeys = [];
    let openKeys = [];

    items.forEach((item) => {
      const isCurrentActive =
        (item.activePaths && item.activePaths.includes(currentPath)) ||
        item.link === currentPath ||
        item.name === currentPageModule;

      if (isCurrentActive) {
        activeKeys.push(item.name);
        openKeys.push(...parentKeys);
      }

      if (item.children && item.children.length > 0) {
        const childKeys = findActiveKeys(
          item.children,
          currentPath,
          currentPageModule,
          [...parentKeys, item.name]
        );

        if (childKeys.activeKeys.length > 0) {
          activeKeys.push(...childKeys.activeKeys);
          openKeys.push(...childKeys.openKeys, item.name);
        }
      }
    });

    return { activeKeys, openKeys: [...new Set(openKeys)] };
  };

  const activeMenuKeys = useMemo(() => {
    if (!menus) return { activeKeys: [], openKeys: [] };
    return findActiveKeys(menus, location.pathname, pageModule);
  }, [menus, location.pathname, pageModule]);

  return (
    <Sider
      width={250}
      collapsible
      collapsed={isCollapsible.status}
      onCollapse={(value) =>
        setIsCollapsible({
          status: value,
        })
      }
    >
      {menusQuery.isLoading ? (
        <>loading ...</>
      ) : (
        <>
          <Menu
            theme="dark"
            className="menu__sidebar"
            defaultSelectedKeys={["0"]}
            selectedKeys={activeMenuKeys.activeKeys}
            defaultOpenKeys={activeMenuKeys.openKeys}
            mode="inline"
            items={menus?.map(
              ({ link, icon, title, name, badge, children = [] }) => ({
                icon: icon ? (
                  <Tooltip title={title} placement="right">
                    <Icon type={icon} />
                  </Tooltip>
                ) : null,
                key: name,
                label: (
                  <>
                    {children.length === 0 ? (
                      <Link className="menu__link" to={link}>
                        {title}
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
                        icon: icon ? (
                          <Tooltip title={title} placement="right">
                            <Icon type={icon} />
                          </Tooltip>
                        ) : null,
                        key: name,
                        label: (
                          <Link className="menu__link" to={link}>
                            {title}
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
