import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Config from "../constants/config";

const Submit = (props) => {
  const { pageModule } = useParams();
  const { t } = useLanguage();
  const [clicked, setClicked] = useState(false);

  const handleSubmit = useCallback(
    (redirect = false) => {
      if (!props.form) return;
      setClicked(true);
      props.form.redirect = redirect;
      props.form.submit();
    },
    [props.form]
  );

  useEffect(() => {
    if (props.loading === false) {
      setClicked(false);
    }
  }, [props.loading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  const items = useMemo(() => {
    const ed = props.actions || {};
    const menu = [];

    // Submit and close → index page
    if (ed.index === true) {
      menu.push({
        label: t.SUBMIT_AND_CLOSE,
        key: "submit-close",
        onClick: () => {
          handleSubmit(`/${Config.prefix}/${pageModule}`);
        },
      });
    }

    // Submit and new → create page
    if (ed.create === true) {
      menu.push({
        label: t.SUBMIT_AND_NEW,
        key: "submit-new",
        onClick: () => {
          handleSubmit(`/${Config.prefix}/${pageModule}/create-edit`);
        },
      });
    }

    return menu;
  }, [props.actions, t, handleSubmit, pageModule]);

  return (
    <Space.Compact>
      <Button
        type="primary"
        data-cy={props.testId}
        loading={props.loading && clicked}
        disabled={props.loading}
        onClick={() => handleSubmit()}
      >
        {props.display ? props.display : props.pageId ? t.UPDATE : t.CREATE}
      </Button>
      {items.length > 0 && (
        <Dropdown menu={{ items }}>
          <Button type="primary" icon={<DownOutlined />} />
        </Dropdown>
      )}
    </Space.Compact>
  );
};

export default Submit;
