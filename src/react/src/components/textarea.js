import { Form, Input } from "antd";

import { separationRules } from "../lib/helpers";

const { TextArea } = Input;

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

  // console.log("🚀 ~ file: text.js ~ line 14 ~ Text ~ rules", rules)

  return (
    <>
      <Form.Item
        label={props.display}
        name={props.name.split("+")}
        initialValue={props.value}
        rules={rules}
      >
        <TextArea placeholder={props.options.placeholder} />
      </Form.Item>
    </>
  );
};

export default Text;
