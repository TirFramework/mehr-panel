import { useState } from "react";
import { Form, Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { separationRules, isRequired } from "../lib/helpers";

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
  return (
    <>
      {!editing ? (
        <>
          <Button type="link" onClick={editingHandel} icon={<EditOutlined />} />
          {props.value}
        </>
      ) : (
        <Form.Item
          label={props.display}
          name={props.name}
          rules={rules}
          initialValue={props.value}
        >
          <Input
            placeholder={props.options.placeholder}
            disabled={props.readonly}
            className={props.readonly && "readOnly"}
          />
        </Form.Item>
      )}
    </>
  );
};

export default Slug;
