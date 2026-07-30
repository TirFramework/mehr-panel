import React, { useState } from "react";
import { Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { separationRules, isRequired } from "../lib/helpers";
import { LabeledFormItem } from "../lib/fieldLabel";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

const Password = (props) => {
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
        <LabeledFormItem
          display={props.display}
          hideLabel={props.hideLabel}
          inlineLabel={props.inlineLabel}
          options={props.options}
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
        </LabeledFormItem>
      )}
    </>
  );
};

export default Password;
