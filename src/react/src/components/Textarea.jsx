import React from "react";
import { Form, Input } from "antd";

import { separationRules } from "../lib/helpers";

const { TextArea: Textarea } = Input;

const TextareaComponent = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    return (
      <>
        {props.hideLable ?? <div>{props.display}</div>}
        {props.value}
      </>
    );
  }

  return (
    <>
      <Form.Item
        label={props.display}
        name={props.name}
        initialValue={props.value}
        rules={rules}
      >
        <Textarea
          disabled={props.disabled}
          placeholder={props.options.placeholder}
          rows={props.row}
          className={props.readonly && "readOnly"}
        />
      </Form.Item>
    </>
  );
};

export default TextareaComponent;
