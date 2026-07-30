import React, { useEffect, useState } from "react";
import { Col } from "antd";

import Field from "./Field";
import { resolveFieldColProps } from "../lib/helpers/fieldCol";

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
        {...resolveFieldColProps(props.col)}
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
