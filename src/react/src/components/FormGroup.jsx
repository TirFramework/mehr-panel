import React, { useEffect, useState } from "react";
import { Col } from "antd";

import Field from "./Field";

const FormGroup = (props) => {
  const [, setFields] = useState([]);

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
