import React, { memo, useMemo, useState, useEffect } from "react";
import { Badge, Layout, Menu, Tooltip } from "antd";
import { Link, useParams, useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import * as antdIcons from "@ant-design/icons"; // تمام آیکن‌ها را وارد کنید
import { useSidebar } from "../Request";
import useLocalStorage from "../hooks/useLocalStorage";

const { Sider } = Layout;

// کش برای آیکن‌ها
const iconCache = new Map();

// تابع برای دریافت آیکن از کش یا لود کردن آن
const getIconComponent = (iconName) => {
  if (!iconName) return null;

  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }

  const IconComponent = antdIcons[iconName] || antdIcons.QuestionCircleFilled;
  iconCache.set(iconName, IconComponent);
  return IconComponent;
};

// Memoized Icon Component
const MyIcon = memo(
  function MyIcon({ type }) {
    const IconComponent = useMemo(() => getIconComponent(type), [type]);

    return IconComponent ? <IconComponent /> : <LoadingOutlined />;
  },
  (prevProps, nextProps) => prevProps.type === nextProps.type
);

// Memoized Sidebar Component
const Sidebar = memo(function App() {
  const { data: menus, ...menusQuery } = useSidebar();
  const [isCollapsible, setIsCollapsible] = useLocalStorage("collapsible", {
    status: false,
  });

  const { pageModule } = useParams();
  const location = useLocation();

  const [openKeys, setOpenKeys] = useState([]);

  const findActiveKeys = (
    items,
    location,
    currentPageModule,
    parentKeys = []
  ) => {
    let activeKeys = [];
    let newOpenKeys = [];

    items.forEach((item) => {
      const isCurrentActive = () => {
        // return false;

        const currentPath = location.pathname + location.search;

        let r = false;
        if (item.activePaths && item.activePaths.length > 0) {
          r = item.activePaths.includes(currentPath);
        } else {
          r = item.link === currentPath || item.name === currentPageModule;
        }
        return r;
      };

      if (isCurrentActive()) {
        activeKeys.push(item.name);
        newOpenKeys.push(...parentKeys);
      }

      if (item.children && item.children.length > 0) {
        const childKeys = findActiveKeys(
          item.children,
          location,
          currentPageModule,
          [...parentKeys, item.name]
        );

        if (childKeys.activeKeys.length > 0) {
          activeKeys.push(...childKeys.activeKeys);
          newOpenKeys.push(...childKeys.openKeys, item.name);
        }
      }
    });

    return { activeKeys, openKeys: [...new Set(newOpenKeys)] };
  };

  const activeMenuKeys = useMemo(() => {
    if (!menus) return { activeKeys: [], openKeys: [] };
    return findActiveKeys(menus, location, pageModule);
  }, [menus, location, pageModule]);

  useEffect(() => {
    if (
      activeMenuKeys.openKeys.length > 0 &&
      activeMenuKeys.openKeys.some((key) => !openKeys.includes(key))
    ) {
      setOpenKeys(activeMenuKeys.openKeys);
    }
  }, [activeMenuKeys.openKeys]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

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
        <>loading ....</>
      ) : (
        <Menu
          theme="dark"
          className="menu__sidebar"
          defaultSelectedKeys={["0"]}
          selectedKeys={activeMenuKeys.activeKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          mode="inline"
          items={menus.map(
            ({ link, icon, title, name, badge, children = [] }) => ({
              icon: icon ? (
                <Tooltip title={title} placement="right">
                  <MyIcon type={icon} />
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
                          <MyIcon type={icon} />
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
      )}
    </Sider>
  );
});

export default Sidebar;
