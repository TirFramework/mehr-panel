import React from "react";
import { Button, Col, Row, Space } from "antd";
// import { Link, useHistory, useParams } from "react-router-dom";
import Field from "./Field";
import { useMyContext } from "../context/MyContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";

const SubmitGroup = (props) => {
  const { myState } = useMyContext();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [urlParams, setUrlParams] = useSearchParams();
  const pageId = urlParams.get("id");
  // const editMode = urlParams.editMode;
  const { pageModule } = useParams();

  // const history = useHistory();

  // const goBack = () => {
  //   history.goBack();
  // };

  return (
    <Row justify={"end"}>
      <Col>
        <Space>
          {props.buttons?.map((btn, index) => (
            <Field
              {...btn}
              key={`btn-${index}`}
              type={btn.action}
              form={props.form}
              loading={myState?.isLoading}
            />
          ))}

          {props.type === "detail" && (
            <>
              {props?.actions?.edit === true && (
                <Button
                  onClick={() => {
                    navigate(
                      `/${Config.perfix}/${pageModule}/create-edit?id=${pageId}`
                    );
                  }}
                >
                  {t.EDIT}
                </Button>
              )}
            </>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default SubmitGroup;
