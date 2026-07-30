import React from "react";
import { InputNumber } from "antd";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel, fieldCommentTooltip } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
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
    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    const readonlyOptions = {
      ...(typeof props.options === "object" && props.options
        ? props.options
        : {}),
      addonBefore: addonBefore ?? currency,
      addonAfter,
    };

    return (
      <Readonly
        data-cy={props.testId}
        label={label}
        inline={inline}
        options={readonlyOptions}
        comment={props.comment}
      >
        {formatNumberWithSeparator(props.value)}
      </Readonly>
    );
  }

  return (
    <LabeledFormItem
      display={props.display}
      hideLabel={props.hideLabel}
      inlineLabel={props.inlineLabel}
      options={props.options}
      tooltip={fieldCommentTooltip(props.comment)}
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
    </LabeledFormItem>
  );
};

export default Price;
