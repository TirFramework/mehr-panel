import { Layout, Menu, Breadcrumb } from "antd";
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";


import Sidebar from "../blocks/Sidebar";
import Footer from "../blocks/Footer";

const { Header, Content } = Layout;
const { SubMenu } = Menu;

function App( props ) {

  console.log('layout');
  return (
    <Layout className="bg-gray-800" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>

          {props.children}

        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default App;
