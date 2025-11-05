import { Form, Input } from "antd";

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
      <Form.Item style={{display:'none;'}}
        name={props.name}
        initialValue={props.value ?? props.defaultValue}
        rules={rules}
      >
        <Input
          placeholder={props.options.placeholder}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
          type="hidden"

        />
      </Form.Item>
    </>
  );
};

export default Text;
