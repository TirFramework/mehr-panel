import React from "react";
import { Form, Radio } from "antd";

import { separationRules } from "../lib/helpers";

const Field = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  return (
    <>
      <Form.Item
        name={props.name}
        label={props.display}
        initialValue={props.value}
        rules={rules}
      >
        <Radio.Group
          mode={props.multiple ? "multiple" : false}
          options={props.data}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
          allowClear={!props.readonly && true}
          optionType="button"
          buttonStyle="solid"
        ></Radio.Group>
      </Form.Item>
    </>
  );
};

export default Field;
