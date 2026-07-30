import React from "react";
import { Input, InputNumber } from "antd";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel, fieldCommentTooltip } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
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

    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    return (
      <Readonly
        data-cy={props.testId}
        label={label}
        inline={inline}
        options={props.options}
        comment={props.comment}
      >
        {displayValue}
      </Readonly>
    );
  }

  if (allowLeadingZeros) {
    return (
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        tooltip={fieldCommentTooltip(props.comment)}
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
      </LabeledFormItem>
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
    </LabeledFormItem>
  );
};

export default NumberIndex;
