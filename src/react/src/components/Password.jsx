import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { separationRules, isRequired } from "../lib/helpers";
import { formItemLabelProps } from "../lib/fieldLabel";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

const Text = (props) => {
  // console.log("🚀 ~ file: text.js ~ line 6 ~ Text ~ data", data)
  // console.log("🚀 ~ ---------------------------------------------------")
  // console.log("🚀 ~ file: text.js ~ line 15 ~ Text ~ data.display", data.display)
  // console.log("🚀 ~ file: text.js ~ line 6 ~ Text ~ data", data)

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const [editing, setEditing] = useState(isRequired(rules));

  const editingHandel = () => {
    setEditing(true);
  };
  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );

  return (
    <>
      {!editing ? (
        <Button type="primary" onClick={editingHandel}>
          Change Password
        </Button>
      ) : (
        <Form.Item
          {...formItemLabelProps({
            display: props.display,
            hideLabel: props.hideLabel,
            options: props.options,
          })}
          name={props.name}
          rules={rules}
        >
          <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
            <Input.Password
              {...inputOptions}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </InputAddonWrapper>
        </Form.Item>
      )}
    </>
  );
};

export default Text;
