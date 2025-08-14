import React from "react";
import { Card, Form } from "antd";

import AntdTinymce from "./AntdTinymce";
import { separationRules } from "../lib/helpers";

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
        {props.hideLable ?? <div>{props.display}</div>}
        <Card size="small" className="read-only__value--editor">
          <div dangerouslySetInnerHTML={{ __html: props.value }} />
        </Card>
      </>
    );
  }

  return (
    <>
      <Form.Item
        label={props.display}
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
