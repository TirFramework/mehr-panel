import { useState } from "react";
import { Form, Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { separationRules, isRequired } from "../lib/helpers";

const MyInput = ({ onChange, value, ...props }) => {
  const slugify = (str) => {
    console.log("🚀 ~ slugify ~ str:", str);
    const text = String(str)
      .normalize("NFKD") // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove consecutive hyphens
    console.log("🚀 ~ slugify ~ text:", text);

    return text;
  };

  return (
    <Input
      onChange={(data) => {
        onChange(slugify(data.target.value));
      }}
      value={value}
    />
  );
};

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
      <Button
        type="link"
        onClick={editingHandel}
        icon={<EditOutlined />}
        style={{ display: !editing ? "none" : "flex" }}
      >
        {props.value}
      </Button>
      <Form.Item
        label={props.display}
        name={props.name}
        rules={rules}
        initialValue={props.value}
        style={{ display: editing ? "none" : "block" }}
      >
        <MyInput
          // {...props}
          placeholder={props.options.placeholder}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
        />
      </Form.Item>
    </>
  );
};

export default Slug;
