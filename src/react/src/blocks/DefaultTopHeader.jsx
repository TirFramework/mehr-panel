import React from "react";
import { Layout, Row, Typography, Button, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, ExportOutlined } from "@ant-design/icons";
import { clearApiToken } from "../lib/authToken";
import * as api from "../api";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";

const { Header } = Layout;

/** Built-in header — import in a CustomTopHeader override to compose. */
export default function DefaultTopHeader({ username, name }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const logout = () => {
    api.postLogout().then(() => {
      clearApiToken();
      navigate(`/${Config.prefix}/login`);
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
}
