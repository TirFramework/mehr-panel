import React from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";

const Cancel = (props) => {
  const { pageModule } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Button
      disabled={props.loading}
      onClick={() => {
        navigate(props.path || `/${Config.prefix}/${pageModule}`);
      }}
    >
      {props.display || t.CANCEL}
    </Button>
  );
};

export default Cancel;
