import React from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb, Typography } from "antd";
import { useLanguage } from "../context/LanguageContext";

const Header = ({ pageTitle, type }) => {
  const [urlParams] = useSearchParams();
  const { t } = useLanguage();

  const pageId = urlParams.get("id");
  let newId = urlParams.get("newId");

  const items = [
    {
      title: pageTitle,
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
        {pageTitle}
      </Typography.Title>
    </header>
  );
};

export default Header;
