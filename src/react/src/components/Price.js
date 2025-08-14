import { Form, InputNumber } from "antd";
import { useState } from "react";

import { separationRules } from "../lib/helpers";

const Price = (props) => {
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
        {props.currency} {props.value}
      </>
    );
  }

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
          disabled={props.disabled}
          style={{ width: "100%" }}
          className={`w-full`}
          addonBefore={
            props.currency ? (
              props.currency.trim().startsWith("<svg") ? (
                <span dangerouslySetInnerHTML={{ __html: props.currency }} />
              ) : (
                <span>{props.currency}</span>
              )
            ) : null
          }
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        />
      </Form.Item>
    </>
  );
};

export default Price;
