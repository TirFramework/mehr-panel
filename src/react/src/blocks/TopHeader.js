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
} from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import * as api from "../api";

const { Header } = Layout;

const TopHeader = (props) => {
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
        <Row
          justify="end"
          gutter={16}
          align="middle"
          className="text-right flex align-middle h-full"
        >
          <Col>
            <div className="text-right username sentry-unmask">
              {props.username}
            </div>
          </Col>
          <Col>
            <Button shape="circle" onClick={logout} icon={<LogoutOutlined />} />
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default TopHeader;
