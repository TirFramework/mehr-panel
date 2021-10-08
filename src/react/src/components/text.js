import { Form, Input } from "antd";

import { separationRules } from "../lib/helpers";

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

  return (
    <>
      <Form.Item
        label={props.display}
        name={props.name}
        initialValue={props.value}
        rules={rules}
        >
        <Input placeholder={props.options.placeholder} disabled={props.disabled} className={props.readonly && 'readOnly' }/>
      </Form.Item>
    </>
  );
};

export default Text;
