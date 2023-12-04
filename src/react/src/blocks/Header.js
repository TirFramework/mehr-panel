import { useParams } from "react-router-dom";
import { Breadcrumb, Typography } from "antd";
const Header = (props) => {
  const { pageModule } = useParams();
  const { pageType } = useParams();

  return (
    <header className="create-edit__header">
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">
          {props.pageTitle}
        </Breadcrumb.Item>
        <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
      </Breadcrumb>
      <Typography.Title className="capitalize create-edit__title">
        {props.pageTitle}
      </Typography.Title>
    </header>
  );
};

export default Header;
