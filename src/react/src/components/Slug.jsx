import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { separationRules, isRequired } from "../lib/helpers";
import { formItemLabelProps } from "../lib/fieldLabel";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

const Slug = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const [editing, setEditing] = useState(props.pageType === "create");

  const editingHandel = () => {
    setEditing(true);
  };
  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );

  return (
    <>
      {!editing ? (
        <>
          <Button type="link" onClick={editingHandel} icon={<EditOutlined />} />
          {props.value}
        </>
      ) : (
        <Form.Item
          {...formItemLabelProps({
            display: props.display,
            hideLabel: props.hideLabel,
            options: props.options,
          })}
          name={props.name}
          rules={rules}
          initialValue={props.value}
        >
          <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
            <Input
              placeholder={inputOptions.placeholder}
              disabled={props.disabled}
              className={props.readonly && "readOnly"}
              {...inputOptions}
            />
          </InputAddonWrapper>
        </Form.Item>
      )}
    </>
  );
};

export default Slug;
