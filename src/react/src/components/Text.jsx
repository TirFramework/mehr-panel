import React from "react";
import { Form, Input, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";
import { formItemLabelProps, readonlyFieldLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

const fieldCommentTooltip = (comment) => {
  if (comment?.content === undefined) {
    return undefined;
  }

  return {
    title: (
      <>
        {comment.title ? <div>{comment.title}</div> : null}
        <div>{comment.content}</div>
      </>
    ),
    icon: <QuestionCircleOutlined />,
  };
};

const Text = ({
  defaultValue,
  pageType,
  rules,
  creationRules,
  updateRules,
  readonly,
  hideLabel,
  display,
  comment,
  name,
  testId,
  options,
  placeholder,
  disable,
  value,
  relation,
  ...props
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

    return (
      <Readonly data-cy={testId}>
        {readonlyFieldLabel({ display, hideLabel, options })}
        {valueContent}
      </Readonly>
    );
  }

  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(options);

  return (
    <>
      <Form.Item
        {...formItemLabelProps({ display, hideLabel, options })}
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
      </Form.Item>
    </>
  );
};

export default Text;
