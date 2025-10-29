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
      <Col
        // span={props.col}
        xs={24}
        sm={24}
        md={24}
        lg={props.col}
        xl={props.col}
        xxl={props.col}
        className={`${props.className} formGroup formGroup-${props.type}`}
      >
        <Field
          addrow={props.addrow}
          removeRow={props.removeRow}
          loading={props.loading}
          index={props.index}
          {...props}
        />
      </Col>
    </>
  );
};

export default FormGroup;
