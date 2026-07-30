import React, { useEffect, useState } from "react";
import { Col } from "antd";

import Field from "./Field";
import { resolveFieldClassName } from "../lib/fieldLabel";
import { resolveFieldColProps } from "../lib/helpers/fieldCol";

const FormGroup = (props) => {
  const [, setFields] = useState([]);

  useEffect(() => {
    if (props.additional === true) {
      setFields([props]);
    }
  }, [props]);

  const fieldClassName = resolveFieldClassName({
    className: props.className,
    class: props.class,
    options: props.options,
    extra: ["formGroup", `formGroup-${props.type}`],
  });

  return (
    <>
      <Col
        {...resolveFieldColProps(props.col)}
        className={fieldClassName}
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
