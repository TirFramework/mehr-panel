import { useState } from "react";
import { Form, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { separationRules, isRequired } from "../lib/helpers";

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
  console.log(
    "🚀 ~ file: Password.js ~ line 21 ~ Text ~ isRequired(rules)",
    isRequired(rules)
  );

  const editingHandel = () => {
    setEditing(true);
  };
  return (
    <>
      {console.log("rulse", rules)}
      {!editing ? (
        <div className="ant-row ant-form-item">
          <div className="ant-col ant-col-6 ant-form-item-label">
            <label title={props.name}>{props.name}:</label>
          </div>
          <div className="ant-col ant-col-18">
            <Button type="primary" onClick={editingHandel}>
              Editing
            </Button>
          </div>
        </div>
      ) : (
        <Form.Item
          label={props.display}
          name={props.name.split("+")}
          rules={rules}
        >
          <Input.Password
            placeholder={props.options.placeholder}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
      )}
    </>
  );
};

export default Text;
