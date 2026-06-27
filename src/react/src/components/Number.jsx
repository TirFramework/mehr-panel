import React from "react";
import { Form, Input, InputNumber } from "antd";

import { separationRules } from "../lib/helpers";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";
import {
  buildLeadingZeroRules,
  formatNumberWithSeparator,
  parseNumberWithSeparator,
  resolveNumberSeparator,
  resolveStringInitialValue,
  sanitizeDigitsOnly,
} from "../lib/helpers/numberSeparator";

const NumberIndex = (props) => {
  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );
  const {
    separator,
    formatter,
    parser,
    allowLeadingZeros,
    ...restInputOptions
  } = inputOptions;
  const separatorChar = resolveNumberSeparator(separator);

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const numberRules =
    rules?.map((rule) => {
      if (rule.required) {
        return rule;
      }
      return {
        ...rule,
        type: "number",
      };
    }) || [];

  const leadingZeroRules = buildLeadingZeroRules(rules);

  if (props.readonly) {
    const displayValue = allowLeadingZeros
      ? props.value
      : separatorChar
        ? formatNumberWithSeparator(props.value, separatorChar)
        : props.value;

    return (
      <div data-cy={props.testId} className="read-only">
        {props.hideLable ?? <div>{props.display}</div>}
        {displayValue}
      </div>
    );
  }

  if (allowLeadingZeros) {
    return (
      <Form.Item
        label={props.display}
        name={props.name}
        initialValue={resolveStringInitialValue(
          props.value,
          props.defaultValue
        )}
        getValueFromEvent={(event) => sanitizeDigitsOnly(event.target.value)}
        rules={leadingZeroRules}
      >
        <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
          <Input
            data-cy={props.testId}
            {...restInputOptions}
            inputMode="numeric"
            disabled={props.disable}
            style={{ width: "100%" }}
          />
        </InputAddonWrapper>
      </Form.Item>
    );
  }

  return (
    <Form.Item
      label={props.display}
      name={props.name}
      initialValue={props.value || props.defaultValue}
      rules={numberRules}
    >
      <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
        <InputNumber
          data-cy={props.testId}
          {...restInputOptions}
          disabled={props.disable}
          style={{ width: "100%" }}
          formatter={
            separatorChar
              ? (value) => formatNumberWithSeparator(value, separatorChar)
              : formatter
          }
          parser={
            separatorChar
              ? (value) => parseNumberWithSeparator(value, separatorChar)
              : parser
          }
        />
      </InputAddonWrapper>
    </Form.Item>
  );
};

export default NumberIndex;
