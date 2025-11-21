import React, { useState, useEffect } from "react";
import { Form, Select, Tag } from "antd";

import { separationRules } from "../lib/helpers";
import Readonly from "../blocks/Readonly";

const MySelect = (props) => {
  return (
    <Select
      {...props.options}
      data-cy={props.testId}
      showSearch
      filterOption={(input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      mode={props.multiple ? "multiple" : false}
      options={props.data.sort((a, b) => a.label.localeCompare(b.label))}
      disabled={props.disable}
      allowClear={!props.readonly && true}
      value={props.value}
      onChange={(val) => {
        if (val !== undefined) {
          props.onChange(val);
        }
      }}
      onClear={() => {
        props.onChange(null);
      }}
    />
  );
};

// const handelDefaultValue = (defaultValue) => {
//   if (isNaN(Number(defaultValue))) {
//     return defaultValue;
//   } else {
//     return Number(defaultValue);
//   }
// };

const SelcetIndex = ({ defaultValue, ...props }) => {
  const [value, setValue] = useState(props.value || defaultValue);
  useEffect(() => {
    setValue(props.value || defaultValue);
  }, [props.value, defaultValue]);

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  // Extract the display field name from relation if available
  const getDisplayFieldName = () => {
    if (props.relation && props.relation.field) {
      return props.relation.field;
    }
    return null;
  };

  // Extract value from relation object using the defined display field
  // Handles both MongoDB objects and simple IDs/strings/booleans from MySQL
  const extractRelationValue = (val) => {
    // If it's an object (MongoDB relation case), extract the display field
    if (typeof val === 'object' && val !== null) {
      const displayField = props.relation?.field;
      // If relation field is defined, use it; otherwise use first non-null value
      if (displayField && val[displayField] !== undefined) {
        return val[displayField];
      }
      return Object.values(val).find(v => v !== null);
    }

    // For all other cases (string, number, boolean, etc.), return as-is
    return val;
  };

  if (props.readonly) {
    if (props.value) {
      if (typeof props.value === "object" && Array.isArray(props.value)) {
        return (
          <Readonly data-cy={props.testId}>
            {props.hideLable ?? <div>{props.display}</div>}
            <div>
              {props.value.map((i) => {
                // Extract ID from MongoDB relation object if needed
                const displayValue = extractRelationValue(i);
                if (!props.dataSet[displayValue]) {
                  return <Tag key={displayValue}>{displayValue}</Tag>;
                }
                return <Tag key={displayValue}>{props.dataSet[displayValue]}</Tag>;
              })}
            </div>
          </Readonly>
        );
      } else {
        // Extract ID from MongoDB relation object if needed
        const displayValue = extractRelationValue(props.value);
        return (
          <Readonly data-cy={props.testId}>
            {props.hideLable ?? <div>{props.display}</div>}
            <div>
              <Tag>{props.dataSet[displayValue] || displayValue}</Tag>
            </div>
          </Readonly>
        );
      }
    }
    return;
  }

  return (
    <>
      <Form.Item
        name={props.name}
        label={props.display}
        initialValue={value}
        rules={rules}
      >
        <MySelect
          {...props}
          value={value}
          onChange={(val) => {
            setValue(val);
          }}
        />
      </Form.Item>
    </>
  );
};

export default SelcetIndex;
