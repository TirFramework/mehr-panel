import React, { useState, useEffect } from "react";
import { Form, Select } from "antd";

import { separationRules } from "../lib/helpers";

const MySelect = (props) => {
  return (
    <Select
      showSearch
      filterOption={(input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      mode={props.multiple ? "multiple" : false}
      options={props.data.sort((a, b) => a.label.localeCompare(b.label))}
      disabled={props.readonly}
      className={props.readonly && "readOnly"}
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
    ></Select>
  );
};

const Text = (props) => {
  const [value, setValue] = useState(props.value || props.defaultValue);
  useEffect(() => {
    setValue(props.value || props.defaultValue);
  }, []);

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });
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
        ></MySelect>
      </Form.Item>
    </>
  );
};

export default Text;
