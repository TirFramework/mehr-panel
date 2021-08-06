import { Form, Input } from "antd";

import separationRules from "../lib/helpers";

const Text = (data) => {
console.log("🚀 ~ file: text.js ~ line 6 ~ Text ~ data", data)
// console.log("🚀 ~ ---------------------------------------------------")
// console.log("🚀 ~ file: text.js ~ line 15 ~ Text ~ data.display", data.display)
// console.log("🚀 ~ file: text.js ~ line 6 ~ Text ~ data", data)

  const rules = separationRules({
    pageType: data.pageType,
    rules: data.roles,
    creationRules: data.creationRules,
    updateRules: data.updateRules,
  });

  // console.log("🚀 ~ file: text.js ~ line 14 ~ Text ~ rules", rules)

  return (
    <>
      <Form.Item
        label={data.display}
        name={data.name}
        initialValue={data.value}
        disable={data.loading}
        rules={rules}
        >
        <Input placeholder={data.options.placeholder} />
      </Form.Item>
    </>
  );
};

export default Text;
