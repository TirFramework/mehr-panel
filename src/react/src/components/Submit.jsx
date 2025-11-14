import React from "react";
import { Button } from "antd";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState, useCallback } from "react";

const Submit = (props) => {
  const { t } = useLanguage();
  const [clicked, setClicked] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!props.form) return;
    setClicked(true);
    props.form.redirect = false;
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

  return (
    <Button
      type="primary"
      data-cy={props.testId}
      loading={props.loading && clicked}
      disabled={clicked ? false : props.loading}
      onClick={handleSubmit}
    >
      {props.display ? props.display : props.pageId ? t.UPDATE : t.CREATE}
    </Button>
  );
};

export default Submit;
