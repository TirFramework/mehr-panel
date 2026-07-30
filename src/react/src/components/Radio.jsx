import React from "react";
import { Form, Radio, Tag } from "antd";

import { separationRules } from "../lib/helpers";
import { formItemLabelProps, readonlyFieldLabel } from "../lib/fieldLabel";

const Field = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    if (typeof props.value === "object") {
      return (
        <div data-cy={props.testId} className="read-only">
          {readonlyFieldLabel({
            display: props.display,
            hideLable: props.hideLable,
            options: props.options,
          })}
          <div>
            {props.value.map((i) => (
              <Tag>{props.dataSet[i]}</Tag>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div data-cy={props.testId} className="read-only">
          {readonlyFieldLabel({
            display: props.display,
            hideLable: props.hideLable,
            options: props.options,
          })}
          <div>
            <Tag>{props.dataSet[props.value]}</Tag>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <Form.Item
        name={props.name}
        {...formItemLabelProps({
          display: props.display,
          hideLable: props.hideLable,
          options: props.options,
        })}
        initialValue={props.value}
        rules={rules}
      >
        <Radio.Group
          data-cy={props.testId}
          {...props.options}
          mode={props.multiple ? "multiple" : false}
          options={props.data}
          disabled={props.disabled}
          allowClear={!props.disabled && true}
          optionType="button"
          buttonStyle="solid"
        ></Radio.Group>
      </Form.Item>
    </>
  );
};

export default Field;
