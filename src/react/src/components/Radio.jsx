import React from "react";
import { Radio, Tag } from "antd";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";

const Field = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    if (typeof props.value === "object") {
      return (
        <Readonly data-cy={props.testId} label={label} inline={inline} options={props.options}>
          <div>
            {props.value.map((i) => (
              <Tag>{props.dataSet[i]}</Tag>
            ))}
          </div>
        </Readonly>
      );
    } else {
      return (
        <Readonly data-cy={props.testId} label={label} inline={inline} options={props.options}>
          <div>
            <Tag>{props.dataSet[props.value]}</Tag>
          </div>
        </Readonly>
      );
    }
  }

  return (
    <>
      <LabeledFormItem
        name={props.name}
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
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
      </LabeledFormItem>
    </>
  );
};

export default Field;
