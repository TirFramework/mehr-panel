import React from "react";
import { Form, Input, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";
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
  hideLable,
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

  // Extract the display field name from relation if available
  const getDisplayFieldName = () => {
    if (relation && relation.field) {
      return relation.field;
    }
    return null;
  };

  // Extract value from relation object using the defined display field
  // Handles both MongoDB objects and MySQL strings
  const extractRelationValue = (val) => {
    // If it's already a string or number, return as-is (MySQL case)
    if (typeof val === 'string' || typeof val === 'number') {
      return val;
    }

    // If it's an object (MongoDB case), extract the display field
    if (typeof val === 'object' && val !== null) {
      const displayField = getDisplayFieldName();
      // If relation field is defined, use it; otherwise use first non-null value
      if (displayField && val[displayField] !== undefined) {
        return val[displayField];
      }
      return Object.values(val).find(v => v !== null);
    }

    return val;
  };

  // Display readonly mode for detail/view pages
  if (readonly) {
    // Show label unless hideLable is true
    const label = hideLable ? null : <div>{display}</div>;

    // Handle different value types
    let valueContent;
    if (Array.isArray(value)) {
      // For arrays: display each item as a tag
      valueContent = value.map((val, index) => {
        const displayValue = extractRelationValue(val);
        return <Tag key={index}>{displayValue}</Tag>;
      });
    } else if (value === null) {
      // For null values: display nothing
      valueContent = null;
    } else {
      // For object and simple values: extract using relation field
      valueContent = extractRelationValue(value);
    }

    return (
      <Readonly data-cy={testId}>
        {label}
        {valueContent}
      </Readonly>
    );
  }

  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(options);

  return (
    <>
      <Form.Item
        label={display}
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
