import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Typography } from "antd";
const Header = ({ pageTitle, type }) => {
  //   const { pageModule } = useParams();
  //   const { pageType } = useParams();
  const [urlParams, setUrlParams] = useSearchParams();

  const pageId = urlParams.get("id");
  let newId = urlParams.get("newId");

  return (
    <header className="create-edit__header">
      <Breadcrumb>
        <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
        <Breadcrumb.Item>
          {type === "detail" ? (
            <>Details</>
          ) : (
            <>{pageId || newId ? "Edit" : "Create"}</>
          )}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Typography.Title className=" create-edit__title">
        {pageTitle}
      </Typography.Title>
    </header>
  );
};

export default Header;
