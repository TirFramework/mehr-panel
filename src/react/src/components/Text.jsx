import React from "react";
import { Input, Tag } from "antd";

import { separationRules } from "../lib/helpers";
import {
  LabeledFormItem,
  resolveReadonlyLabel,
  fieldCommentTooltip,
} from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

const Text = ({
  defaultValue,
  pageType,
  rules,
  creationRules,
  updateRules,
  readonly,
  hideLabel,
  inlineLabel,
  display,
  comment,
  name,
  testId,
  options,
  placeholder,
  disable,
  value,
  relation,
}) => {
  const formRules = separationRules({
    pageType: pageType,
    rules: rules,
    creationRules: creationRules,
    updateRules: updateRules,
  });

  const getDisplayFieldName = () => {
    if (relation && relation.field) {
      return relation.field;
    }
    return null;
  };

  const extractRelationValue = (val) => {
    if (typeof val === "string" || typeof val === "number") {
      return val;
    }

    if (typeof val === "object" && val !== null) {
      const displayField = getDisplayFieldName();
      if (displayField && val[displayField] !== undefined) {
        return val[displayField];
      }
      return Object.values(val).find((v) => v !== null);
    }

    return val;
  };

  if (readonly) {
    let valueContent;
    if (Array.isArray(value)) {
      valueContent = value.map((val, index) => {
        const displayValue = extractRelationValue(val);
        return <Tag key={index}>{displayValue}</Tag>;
      });
    } else if (value === null) {
      valueContent = null;
    } else {
      valueContent = extractRelationValue(value);
    }

    const { label, inline } = resolveReadonlyLabel({
      display,
      hideLabel,
      inlineLabel,
      options,
    });

    return (
      <Readonly
        data-cy={testId}
        label={label}
        inline={inline}
        options={options}
        comment={comment}
      >
        {valueContent}
      </Readonly>
    );
  }

  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(options);

  return (
    <LabeledFormItem
      display={display}
      hideLabel={hideLabel}
      inlineLabel={inlineLabel}
      options={options}
      tooltip={fieldCommentTooltip(comment)}
      name={name}
      initialValue={value || defaultValue}
      rules={formRules}
    >
      <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
        <Input
          data-cy={testId}
          {...inputOptions}
          placeholder={placeholder || inputOptions.placeholder}
          disabled={disable}
        />
      </InputAddonWrapper>
    </LabeledFormItem>
  );
};

export default Text;
