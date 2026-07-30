import React from "react";
import { Card } from "antd";

import AntdTinymce from "./AntdTinymce";
import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";

export default function App(props) {
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
      <Readonly
        data-cy={props.testId}
        label={label}
        inline={inline}
        options={props.options}
        comment={props.comment}
      >
        <Card size="small" className="read-only__value--editor">
          <div dangerouslySetInnerHTML={{ __html: props.value }} />
        </Card>
      </Readonly>
    );
  }

  return (
    <>
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
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
      </LabeledFormItem>
    </>
  );
}
