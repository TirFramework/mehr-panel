import React from "react";
import { Form } from "antd";

import AntdTinymce from "./AntdTinymce";
import { separationRules } from "../lib/helpers";

export default function App(props) {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });
  return (
    <>
      <Form.Item
        label={props.display}
        name={props.name}
        initialValue={props.value}
        rules={rules}
      >
        <AntdTinymce
          {...props}
          initialValue={props.value}
          uploadUrl={props.uploadUrl}
          basePath={props.basePath}
        />
      </Form.Item>
    </>
  );
}
