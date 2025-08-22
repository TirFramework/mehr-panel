import React, { lazy, memo, Suspense } from "react";
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
              {name}
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
              Logout
            </Button>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

const TopHeader = (props) => {
  const CustomTopHeader = "dynamic-layouts/CustomTopHeader.js";
  const DynamicField = lazy(() =>
    import(`../${CustomTopHeader}`).catch((error) => {
      return { default: () => <DefaultTopHeader {...props} /> };
    })
  );
  return (
    <Suspense fallback={<DefaultTopHeader {...props} />}>
      <DynamicField
        {...props}
        // showInIndex={props.id != pageId}
      />
    </Suspense>
  );
};

export default memo(TopHeader);
