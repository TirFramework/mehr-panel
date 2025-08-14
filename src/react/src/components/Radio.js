import React from "react";
import { Form, Radio, Tag } from "antd";

import { separationRules } from "../lib/helpers";

const Field = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    if (typeof props.value === "object") {
      return (
        <>
          {props.hideLable ?? <div>{props.display}</div>}
          <div>
            {props.value.map((i) => (
              <Tag>{props.dataSet[i]}</Tag>
            ))}
          </div>
        </>
      );
    } else {
      return (
        <>
          {props.hideLable ?? <div>{props.display}</div>}
          <div>
            <Tag>{props.dataSet[props.value]}</Tag>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <Form.Item
        name={props.name}
        label={props.display}
        initialValue={props.value}
        rules={rules}
      >
        <Radio.Group
          {...props.options}
          mode={props.multiple ? "multiple" : false}
          options={props.data}
          disabled={props.disabled}
          allowClear={!props.disabled && true}
          optionType="button"
          buttonStyle="solid"
        ></Radio.Group>
      </Form.Item>
    </>
  );
};

export default Field;
