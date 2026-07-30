import React from "react";
import { Input } from "antd";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

const { TextArea: Textarea } = Input;

const TextareaComponent = (props) => {
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

    return (
      <Readonly data-cy={props.testId} label={label} inline={inline} options={props.options}>
        {props.value}
      </Readonly>
    );
  }

  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );

  return (
    <>
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        name={props.name}
        initialValue={props.value}
        rules={rules}
      >
        <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
          <Textarea
            disabled={props.disabled}
            placeholder={inputOptions.placeholder}
            rows={props.row}
            className={props.readonly && "readOnly"}
            {...inputOptions}
          />
        </InputAddonWrapper>
      </LabeledFormItem>
    </>
  );
};

export default TextareaComponent;
