import React, { memo, useMemo, useState, useEffect } from "react";
import { Badge, Layout, Menu, Tooltip, Button } from "antd";
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
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

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

  const hasChildrenMap = useMemo(() => {
    const map = new Map();
    if (!menus) return map;
    const walk = (items) => {
      items.forEach((item) => {
        const hasChildren = !!(item.children && item.children.length > 0);
        map.set(item.name, hasChildren);
        if (hasChildren) walk(item.children);
      });
    };
    walk(menus);
    return map;
  }, [menus]);

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

  const onMenuClick = ({ key }) => {
    if (!isMobile) return;
    const isParent = hasChildrenMap.get(key);
    if (!isParent) {
      setIsOpenSidebar(false);
    }
  };

  const toggleSidebarMobile = () => {
    // setIsCollapsible((prev) => ({ status: !prev.status }));
    if (isMobile) {
      setIsOpenSidebar(!isOpenSidebar);
    } else {
      setIsCollapsible((prev) => ({ status: !prev.status }));
    }
  };

  return (
    <>
      {isMobile && isOpenSidebar ? (
        <div
          onClick={() => toggleSidebarMobile()}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(10px)",
            zIndex: 9,
          }}
        />
      ) : null}

      {isMobile && (
        <Button
          // type="link"
          // shape="circle"
          // size="large"
          onClick={toggleSidebarMobile}
          // color="white"
          size="small"
          style={{
            position: "fixed",
            left: 16,
            top: 20,
            zIndex: 1001,
            // color: "#fff",
          }}
          icon={
            isOpenSidebar ? (
              <antdIcons.MenuFoldOutlined />
            ) : (
              <antdIcons.MenuUnfoldOutlined />
            )
          }
        />
      )}
      <Sider
        width={isMobile && !isOpenSidebar ? 0 : 250}
        // collapsible
        collapsed={isMobile ? false : isCollapsible.status}
        breakpoint="lg"
        collapsedWidth={74}
        onBreakpoint={(broken) => {
          setIsMobile(broken);
          // if (broken) {
          //   setIsCollapsible({ status: true });
          // }
        }}
        // onCollapse={(value) =>
        //   setIsCollapsible({
        //     status: value,
        //   })
        // }
        style={{
          position: isMobile ? "fixed" : "static",
          // top: 0,
          // left: 0,
          // height: "100vh",
          zIndex: 1000,
        }}
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
            onClick={onMenuClick}
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
                      <Link className="menu__link" to={link} title={title}>
                        {title}
                        {badge > 0 && <Badge count={badge} size="small" />}
                      </Link>
                    ) : (
                      <span className="menu__parent" title={title}>
                        {title}
                      </span>
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
                          <Link className="menu__link" to={link} title={title}>
                            {title}
                            {badge > 0 && <Badge count={badge} size="small" />}
                          </Link>
                        ),
                      })),
              })
            )}
          />
        )}
        {!isMobile && (
          <div className="menu__sidebar-footer">
            <Button
              type="link"
              shape="circle"
              block
              size="large"
              onClick={toggleSidebarMobile}
              color="white"
              style={{ color: "white" }}
              icon={
                isCollapsible.status ? (
                  <antdIcons.MenuFoldOutlined />
                ) : (
                  <antdIcons.MenuUnfoldOutlined />
                )
              }
            />
          </div>
        )}
      </Sider>
    </>
  );
});

export default Sidebar;
