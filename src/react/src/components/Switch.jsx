import React from "react";
import { Form, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";
import { formItemLabelProps, readonlyFieldLabel } from "../lib/fieldLabel";

const SwitchIndex = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    return (
      <>
        {readonlyFieldLabel({
          display: props.display,
          hideLabel: props.hideLabel,
          options: props.options,
        })}
        <div className="read-only__value">
          {props.value ? <CheckOutlined /> : <CloseOutlined />}
        </div>
      </>
    );
  }

  return (
    <>
      <Form.Item
        {...formItemLabelProps({
          display: props.display,
          hideLabel: props.hideLabel,
          options: props.options,
        })}
        name={props.name}
        initialValue={props.value || props.defaultValue || false}
        valuePropName="checked"
        rules={rules}
        labelCol={{
          flex: "none",
        }}
        wrapperCol={{
          flex: "auto",
        }}
      >
        <Switch
          {...props.options}
          onChange={props.onChange}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
        />
      </Form.Item>
    </>
  );
};

export default SwitchIndex;
