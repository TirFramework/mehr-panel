import React from "react";
import { Form, Input } from "antd";

import { separationRules } from "../lib/helpers";
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
        {props.hideLable ?? <div>{props.display}</div>}
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
        label={props.display}
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
