import React from "react";
import { ColorPicker as AntdColorPicker } from "antd";
import { separationRules } from "../lib/helpers";
import { LabeledFormItem } from "../lib/fieldLabel";

const ColorPicker = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  return (
    <>
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        name={props.name}
        initialValue={props.value || props.defaultValue}
        rules={rules}
      >
        <MyColorPicker {...props} />
      </LabeledFormItem>
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
