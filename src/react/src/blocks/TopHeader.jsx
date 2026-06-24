import React, { lazy, memo, Suspense } from "react";
import { Layout, Row, Typography, Button, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, ExportOutlined } from "@ant-design/icons";
import { clearApiToken } from "../lib/authToken";
import * as api from "../api";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";

const { Header } = Layout;

const panelSpecificLayouts = import.meta.glob("../dynamic-layouts/*/*.jsx");
const sharedLayouts = import.meta.glob("../dynamic-layouts/*.jsx");

/* --- Default version --- */
const DefaultTopHeader = ({ username, name }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const logout = () => {
    api.postLogout().then(() => {
      clearApiToken();
      navigate(`/${Config.perfix}/login`);
    });
  };

  return (
    <Header className="top-header">
      <Row justify="space-between" gutter={16} align="middle">
        <Col>
          <Typography.Title level={2} className="logo">
            <a href="/" target="_blank" rel="noreferrer">
              <span className="logo-text">{name}</span>
              <small>
                <ExportOutlined />
              </small>
            </a>
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <div className="username">{username}</div>
            <Button onClick={logout} icon={<LogoutOutlined />}>
              <span className="logout-text">{t.LOGOUT}</span>
            </Button>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

const panel = Config.perfix;
const CustomTopHeader = "CustomTopHeader";
const panelSpecificKey = `../dynamic-layouts/${panel}/${CustomTopHeader}.jsx`;
const sharedKey = `../dynamic-layouts/${CustomTopHeader}.jsx`;
const importFn =
  panelSpecificLayouts[panelSpecificKey] ?? sharedLayouts[sharedKey];
const DynamicTopHeader = importFn ? lazy(importFn) : null;

const TopHeader = (props) => {
  if (!DynamicTopHeader) {
    return <DefaultTopHeader {...props} />;
  }

  return (
    <Suspense fallback={<DefaultTopHeader {...props} />}>
      <DynamicTopHeader {...props} />
    </Suspense>
  );
};

export default memo(TopHeader);
