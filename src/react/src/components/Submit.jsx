import React from "react";
import { Button, Dropdown, Space } from "antd";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState, useCallback } from "react";
import { DownOutlined } from "@ant-design/icons";
import Config from "../constants/config";
import { useParams } from "react-router-dom";




const Submit = (props) => {
  const { pageModule } = useParams();

  const { t } = useLanguage();
  const [clicked, setClicked] = useState(false);

  const handleSubmit = useCallback((redirect = false) => {
    if (!props.form) return;
    setClicked(true);
    props.form.redirect = redirect;
    props.form.submit();
  }, [props.form]);

  useEffect(() => {
    if (props.loading === false) {
      setClicked(false);
    }
  }, [props.loading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // استفاده از code برای مستقل بودن از زبان کیبورد
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
        e.preventDefault(); // جلوگیری از Save Page مرورگر
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);


  const items = [
    {
      label: 'Submit and Close',
      key: '1',
      // disabled: clicked ? false : props.loading,
      // loading: props.loading && clicked ,
      onClick: () => {
        handleSubmit( `/${Config.perfix}/${pageModule}`);
      },
    },
    {
      label: 'Submit and New',
      key: '2',
      // disabled: clicked ? false : props.loading ,
      // loading: props.loading && clicked ,

      onClick: () => {
        handleSubmit( `/${Config.perfix}/${pageModule}/create-edit`);
      },
    },
  ];

  return (
    <Space.Compact>
      <Button
        type="primary"
        data-cy={props.testId}
        loading={props.loading && clicked}
        disabled={clicked ? false : props.loading}
        onClick={handleSubmit}
      >
        {props.display ? props.display : props.pageId ? t.UPDATE : t.CREATE}
      </Button>
      <Dropdown menu={{ items }}>
        <Button type="primary" icon={<DownOutlined   />} />
      </Dropdown>    
    </Space.Compact>

  );
};

export default Submit;
