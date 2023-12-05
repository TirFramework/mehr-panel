import { useParams } from "react-router-dom";
import {
  Avatar,
  Dropdown,
  Layout,
  Row,
  Typography,
  Menu,
  Button,
  Col,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, ExportOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import * as api from "../api";

const { Header, Content } = Layout;

const TopHeader = ({ username, name }) => {
  const navigate = useNavigate();

  const logout = () => {
    api.postLogout().then(() => {
      Cookies.remove("api_token");
      navigate("/admin/login");
    });
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>logout</Menu.Item>
    </Menu>
  );
  return (
    <>
      <Header className="px-4">
        <Row justify="space-between" gutter={16} align="middle">
          <Col>
            <Typography.Title level={2} className="logo">
              <a href="/" target="_blank">
                <Space>
                  {name}
                  <small>
                    <ExportOutlined />
                  </small>
                </Space>
              </a>
            </Typography.Title>
          </Col>
          <Col>
            <div className="text-right username sentry-unmask">{username}</div>
            <Button onClick={logout} icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default TopHeader;
