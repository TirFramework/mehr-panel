import React, { lazy, memo, Suspense, useState, useEffect } from "react";
import { Layout, Row, Typography, Button, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, ExportOutlined } from "@ant-design/icons";
import { clearApiToken } from "../lib/authToken";
import * as api from "../api";
import Config from "../constants/config";

const { Header } = Layout;

/* --- نسخه پیش‌فرض --- */
const DefaultTopHeader = ({ username, name }) => {
  const navigate = useNavigate();

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
              <span className="logout-text">Logout</span>
            </Button>
          </Space>
      </Col>
      </Row>
    </Header>
  );
};

const TopHeader = (props) => {
  const [CustomComponent, setCustomComponent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  let CustomTopHeader = 'CustomTopHeader'
  React.useEffect(() => {
    import(`../dynamic-layouts/${CustomTopHeader}.jsx`)
      .then((module) => {
        setCustomComponent(() => module.default);
        setLoading(false);
      })
      .catch(() => {
        setCustomComponent(() => DefaultTopHeader);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <DefaultTopHeader {...props} />;
  }

  const DynamicComponent = CustomComponent;

  return (
    <DynamicComponent
      {...props}
      // showInIndex={props.id != pageId}
    />
  );
};

export default memo(TopHeader);
