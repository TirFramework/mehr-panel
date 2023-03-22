import { useParams } from "react-router-dom";
import { Avatar, Dropdown, Layout, Row, Typography, Menu, Button } from "antd";
import { useHistory } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const { Header } = Layout;

const TopHeader = (props) => {
  let history = useHistory();

  const logout = () => {
    Cookies.remove("api_token");
    history.push("/admin/login");
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
          justify="space-between"
          align="middle"
          className="text-right flex justify-between align-middle h-full"
        >
          <div></div>
          <Button shape="circle" icon={<LogoutOutlined />} />
        </Row>
      </Header>
    </>
  );
};

export default TopHeader;
