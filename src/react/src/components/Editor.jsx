import React from "react";
import { Card, Form } from "antd";

import AntdTinymce from "./AntdTinymce";
import { separationRules } from "../lib/helpers";
import { formItemLabelProps, readonlyFieldLabel } from "../lib/fieldLabel";

export default function App(props) {
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
        <Card size="small" className="read-only__value--editor">
          <div dangerouslySetInnerHTML={{ __html: props.value }} />
        </Card>
      </>
    );
  }

  return (
    <>
      <Form.Item
        {...formItemLabelProps({
          display: props.display,
          hideLabel: props.hideLabel,
          options: props.options,
        })}
        name={props.name}
        initialValue={props.value || props.defaultValue}
        rules={rules}
      >
        <AntdTinymce
          {...props}
          initialValue={props.value}
          uploadUrl={props.uploadUrl}
          basePath={props.basePath}
          disabled={props.disabled}
        />
      </Form.Item>
    </>
  );
}
