import { Form, InputNumber } from "antd";
import { useEffect, useState } from "react";

import { separationRules } from "../lib/helpers";

const NumberIndex = (props) => {
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
          disabled={props.disable}
          style={{ width: "100%" }}
          addonBefore={
            props.options.addonBefore ? (
              props.options.addonBefore.trim().startsWith("<svg") ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: props.options.addonBefore,
                  }}
                />
              ) : (
                <span>{props.options.addonBefore}</span>
              )
            ) : null
          }
        />
      </Form.Item>
    </>
  );
};

export default NumberIndex;
