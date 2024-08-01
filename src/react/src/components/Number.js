import { Form, InputNumber } from "antd";
import { useState } from "react";

import { separationRules } from "../lib/helpers";

const Text = (props) => {
  // console.log("🚀 ~ file: text.js ~ line 6 ~ Text ~ data", data)
  // console.log("🚀 ~ ---------------------------------------------------")
  // console.log("🚀 ~ file: text.js ~ line 15 ~ Text ~ data.display", data.display)
  // console.log("🚀 ~ file: text.js ~ line 6 ~ Text ~ data", data)

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  return (
    <>
      <Form.Item
        label={props.display}
        name={props.name}
        initialValue={
          props.value !== undefined
            ? Number(props.value)
            : Number(props.defaultValue)
            ? Number(props.defaultValue)
            : ""
        }
        rules={rules}
      >
        <InputNumber
          {...props.options}
          placeholder={props.options.placeholder}
          disabled={props.readonly}
          className={`${props.readonly && "readOnly"} w-full`}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </>
  );
};

export default Text;
