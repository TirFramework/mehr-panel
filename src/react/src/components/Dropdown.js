import { Button, Dropdown } from "antd";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { DownOutlined } from "@ant-design/icons";
import Config from "../constants/config";

const Submit = (props) => {
  const { pageModule } = useParams();
  const { t } = useLanguage();

  const items = [
    {
      label: (
        <>
          {props.display ? (
            props.display
          ) : (
            <>{props.pageId ? t.UPDATE_AND_CLOSE : t.CREATE_AND_CLOSE}</>
          )}
        </>
      ),
      onclick: () => {
        props.form.redirect = `${Config.perfix}/${pageModule}`;
        if (props.path) {
          props.form.redirect = props.path;
        }
        props.form.submit();
      },
      key: "1",
    },
  ];
  return (
    <Dropdown.Button
      icon={<DownOutlined />}
      loading={props.loading}
      menu={{ items }}
      onClick={() => {
        props.form.redirect = false;
        props.form.submit();
      }}
    >
      {props.display ? (
        props.display
      ) : (
        <>{props.pageId ? t.UPDATE : t.CREATE}</>
      )}
    </Dropdown.Button>
  );
};

export default Submit;
