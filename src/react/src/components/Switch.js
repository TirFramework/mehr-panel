import { Form, Switch } from "antd";

import { separationRules } from "../lib/helpers";

const Text = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  console.log("🚀 ~ file: switch.js ~ line 18 ~ Text ~ props.name", props.name);
  return (
    <>
      <Form.Item
        label={props.display}
        name={props.name}
        initialValue={props.value}
        valuePropName="checked"
        rules={rules}
        labelCol={{
          flex: "none",
        }}
        wrapperCol={{
          flex: "auto",
        }}
      >
        <Switch />
      </Form.Item>
    </>
  );
};

export default Text;
