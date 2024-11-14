import { Button, Col, Row, Space } from "antd";
// import { Link, useHistory, useParams } from "react-router-dom";
// import { useUrlParams } from "../hooks/useUrlParams";
import Field from "./Field";
import { useMyContext } from "../context/MyContext";

const SubmitGroup = (props) => {
  const { myState } = useMyContext();

  // const [urlParams, , setUrlParams] = useUrlParams();
  // const pageId = urlParams.id;
  // const editMode = urlParams.editMode;
  // const { pageModule } = useParams();

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
              loading={myState}
            />
          ))}
        </Space>
      </Col>
    </Row>
  );
};

export default SubmitGroup;
