import React from "react";
import { Form, ColorPicker as AntdColorPicker } from "antd";
import { separationRules } from "../lib/helpers";
import { formItemLabelProps } from "../lib/fieldLabel";

const ColorPicker = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  return (
    <>
      <Form.Item
        {...formItemLabelProps({
          display: props.display,
          hideLable: props.hideLable,
          options: props.options,
        })}
        name={props.name}
        initialValue={props.value || props.defaultValue}
        rules={rules}
      >
        <MyColorPicker {...props} />
      </Form.Item>
    </>
  );
};

export default ColorPicker;

const MyColorPicker = (props) => {
  return (
    <>
      <AntdColorPicker
        disabled={props.readonly}
        value={props.value}
        onChange={(val) => {
          props.onChange(
            `rgba(${val?.metaColor.r},${val?.metaColor.g},${val?.metaColor.b}, ${val?.metaColor.a})`
          );
        }}
      />
    </>
  );
};
