import { Form, InputNumber } from "antd";

import { separationRules } from "../lib/helpers";

const Text = (props) => {

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
        <InputNumber
            {...props.options}
          disabled={props.readonly}
          className={`${props.readonly && "readOnly"} w-full`}
        />
      </Form.Item>
    </>
  );
};

export default Text;
