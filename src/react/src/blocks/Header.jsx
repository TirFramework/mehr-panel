import React from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Breadcrumb, Typography } from "antd";
import { useLanguage } from "../context/LanguageContext";

const Header = ({ pageTitle, type }) => {
  const [urlParams] = useSearchParams();
  const { pageModule } = useParams();
  const { t } = useLanguage();

  const pageId = urlParams.get("id");
  let newId = urlParams.get("newId");

  const moduleTitle = t[pageModule] || pageTitle;

  const items = [
    {
      title: moduleTitle,
    },
    {
      title:
        type === "detail" ? (
          <>{t.DETAILS}</>
        ) : (
          <>{pageId || newId ? t.EDIT : t.CREATE}</>
        ),
    },
  ];

  return (
    <header className="create-edit__header">
      <Breadcrumb items={items} />
      <Typography.Title level={2} className="create-edit__title">
        {moduleTitle}
      </Typography.Title>
    </header>
  );
};

export default Header;
