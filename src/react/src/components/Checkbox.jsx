import React from "react";
import { Form, Checkbox } from "antd";
import { separationRules } from "../lib/helpers";
import { resolveReadonlyLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import { CheckCircleOutlined } from "@ant-design/icons";

const CheckboxComponent = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    return (
      <Readonly
        data-cy={props.testId}
        label={label}
        inline={inline}
        options={props.options}
        comment={props.comment}
      >
        {props.value ? <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} /> : null}
      </Readonly>
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
