import React from "react";
import { Form, Input } from "antd";

import { separationRules } from "../lib/helpers";
import { formItemLabelProps, readonlyFieldLabel } from "../lib/fieldLabel";
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
    return (
      <>
        {readonlyFieldLabel({
          display: props.display,
          hideLabel: props.hideLabel,
          options: props.options,
        })}
        {props.value}
      </>
    );
  }

  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );

  return (
    <>
      <Form.Item
        {...formItemLabelProps({
          display: props.display,
          hideLabel: props.hideLabel,
          options: props.options,
        })}
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
      </Form.Item>
    </>
  );
};

export default TextareaComponent;
