import { useParams } from "react-router-dom";
import { Avatar, Breadcrumb, Dropdown, Layout, Typography } from "antd";
import { useHistory } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

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
          className="text-right flex justify-between"
        >
          <div></div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <span
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar>U</Avatar>
              <span className="text-white mx-2">Profile</span>
              <DownOutlined className="text-white" />
            </span>
          </Dropdown>
        </Row>
      </Header>
    </>
  );
};

export default TopHeader;
