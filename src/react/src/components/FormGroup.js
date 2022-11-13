import { useEffect, useState } from "react";
import { Button, Col, Row, Space } from "antd";
import { PlusOutlined, DragOutlined, CloseOutlined } from "@ant-design/icons";

import Field from "./Field";
import { getNumberName } from "../lib/helpers";

const FormGroup = (props) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (props.additional === true) {
      setFields([props]);
    }
  }, [props]);

  return (
    <>
      {props.additional ? (
        <>
          <Row className="w-full">
            <Col flex="auto">
              <Col span={24} className={props.className}>
                <Row>
                  <Col flex="auto">
                    <Field {...props} />
                  </Col>

                  <Button
                    shape="circle"
                    disabled={props.loading}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      props.addrow(props.index);
                    }}
                  />
                  <Button
                    icon={<CloseOutlined />}
                    type="text"
                    disabled={props.loading}
                    onClick={() => {
                      props.removeRow(props.index);
                    }}
                    danger
                  />
                </Row>
              </Col>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Col span={props.col} className={props.className}>
            <Field {...props} />
          </Col>
        </>
      )}
    </>
  );
};

export default FormGroup;
