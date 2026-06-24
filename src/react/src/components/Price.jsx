import React from "react";
import { Form, InputNumber } from "antd";

import { separationRules } from "../lib/helpers";

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Price = (props) => {
  const currency = props.currency ?? props.options?.currency;
  const { currency: _currency, ...inputOptions } = props.options ?? {};

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
        {currency} {formatPrice(props.value)}
      </>
    );
  }

  return (
    <>
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
        <InputNumber
          {...inputOptions}
          placeholder={inputOptions.placeholder}
          disabled={props.disabled}
          style={{ width: "100%" }}
          className={`w-full`}
          addonBefore={
            currency ? (
              currency.trim().startsWith("<svg") ? (
                <span dangerouslySetInnerHTML={{ __html: currency }} />
              ) : (
                <span>{currency}</span>
              )
            ) : null
          }
          formatter={formatPrice}
        />
      </Form.Item>
    </>
  );
};

export default Price;
