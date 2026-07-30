import React from "react";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";

const SwitchIndex = (props) => {
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
        {props.value ? <CheckOutlined /> : <CloseOutlined />}
      </Readonly>
    );
  }

  return (
    <>
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        name={props.name}
        initialValue={props.value || props.defaultValue || false}
        valuePropName="checked"
        rules={rules}
      >
        <Switch
          {...props.options}
          onChange={props.onChange}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
        />
      </LabeledFormItem>
    </>
  );
};

export default SwitchIndex;
