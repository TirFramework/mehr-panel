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

  if (props.readonly) {
    if (props.value) {
      if (typeof props.value === "object") {
        return (
          <Readonly data-cy={props.testId}>
            {props.hideLable ?? <div>{props.display}</div>}
            <div>
              {props.value.map((i) => {
                if (!props.dataSet[i]) {
                  return <Tag>{i}</Tag>;
                }
                return <Tag>{props.dataSet[i]}</Tag>;
              })}
            </div>
          </Readonly>
        );
      } else {
        return (
          <Readonly data-cy={props.testId}>
            {props.hideLable ?? <div>{props.display}</div>}
            <div>
              <Tag>{props.dataSet[props.value] || props.value}</Tag>
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
