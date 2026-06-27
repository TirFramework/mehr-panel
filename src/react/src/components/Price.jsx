import React from "react";
import { Form, InputNumber } from "antd";

import { separationRules } from "../lib/helpers";
import {
  formatNumberWithSeparator,
  parseNumberWithSeparator,
} from "../lib/helpers/numberSeparator";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

const Price = (props) => {
  const currency = props.currency ?? props.options?.currency;
  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );
  const { currency: _currency, ...restInputOptions } = inputOptions;

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const priceRules =
    rules?.map((rule) => {
      if (rule.required) {
        return rule;
      }
      return {
        ...rule,
        type: "number",
      };
    }) || [];

  if (props.readonly) {
    return (
      <>
        {props.hideLable ?? <div>{props.display}</div>}
        {currency} {formatNumberWithSeparator(props.value)}
      </>
    );
  }

  return (
    <Form.Item
      label={props.display}
      name={props.name}
      initialValue={
        props.value !== undefined
          ? Number(props.value)
          : Number(props.defaultValue)
            ? Number(props.defaultValue)
            : ""
      }
      rules={priceRules}
    >
      <InputAddonWrapper
        addonBefore={addonBefore ?? currency}
        addonAfter={addonAfter}
      >
        <InputNumber
          {...restInputOptions}
          placeholder={restInputOptions.placeholder}
          disabled={props.disabled}
          style={{ width: "100%" }}
          className="w-full"
          formatter={formatNumberWithSeparator}
          parser={parseNumberWithSeparator}
        />
      </InputAddonWrapper>
    </Form.Item>
  );
};

export default Price;
