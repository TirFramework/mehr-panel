import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Typography } from "antd";
const Header = ({ pageTitle, type }) => {
  //   const { pageModule } = useParams();
  //   const { pageType } = useParams();
  const [urlParams, setUrlParams] = useSearchParams();

  const pageId = urlParams.get("id");
  let newId = urlParams.get("newId");

  const items = [
    {
      title: pageTitle,
    },
    {
      title:
        type === "detail" ? (
          <>Details</>
        ) : (
          <>{pageId || newId ? "Edit" : "Create"}</>
        ),
    },
  ];

  return (
    <header className="create-edit__header">
      <Breadcrumb items={items} />
      <Typography.Title className=" create-edit__title">
        {pageTitle}
      </Typography.Title>
    </header>
  );
};

export default Header;
