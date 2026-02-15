import React from "react";
import { Layout, Row, Typography, Button, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, ExportOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import * as api from "../api";
import Config from "../constants/config";

const { Header } = Layout;

/* --- نسخه پیش‌فرض --- */
const DefaultTopHeader = ({ username, name }) => {
  const navigate = useNavigate();

  const logout = () => {
    api.postLogout().then(() => {
      Cookies.remove("api_token");
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

export default DefaultTopHeader;
