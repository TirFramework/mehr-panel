import React from "react";
import { Form, Checkbox } from "antd";
import { separationRules } from "../lib/helpers";
import { readonlyFieldLabel } from "../lib/fieldLabel";
import { CheckCircleOutlined } from "@ant-design/icons";

const CheckboxComponent = (props) => {
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
          hideLable: props.hideLable,
          options: props.options,
        })}
        {props.value ? <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} /> : <>  </>}
      </>
    );
  }

  return (
    <>
      <Form.Item
        // label={props.display}
        name={props.name}
        initialValue={props.value}
        valuePropName="checked"
        rules={rules}
        labelCol={{
          flex: "none",
        }}
        wrapperCol={{
          flex: "auto",
        }}
      >
        <Checkbox
          onChange={props.onChange}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
        >{props.display}</Checkbox>
      </Form.Item>
    </>
  );
};


export default CheckboxComponent;
