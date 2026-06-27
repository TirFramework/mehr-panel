import React from "react";
import { Button } from "antd";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Config from "../constants/config";
import { useEffect, useState } from "react";

const Submit = (props) => {
  const { pageModule } = useParams();
  const { t } = useLanguage();

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (props.loading === false) {
      setClicked(false);
    }
  }, [props.loading]);

  return (
    <Button
      type="primary"
      loading={props.loading && clicked}
      disabled={props.loading}
      onClick={() => {
        setClicked(true);
        props.form.redirect = `/${Config.prefix}/${pageModule}`;
        if (props.path) {
          props.form.redirect = props.path;
        }
        props.form.submit();
      }}
    >
      <>
        {props.display ? (
          props.display
        ) : (
          <>{props.pageId ? t.UPDATE_AND_CLOSE : t.CREATE_AND_CLOSE}</>
        )}
      </>
    </Button>
  );
};

export default Submit;
