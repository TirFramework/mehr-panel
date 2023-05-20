import { Form, Input } from "antd";

import { separationRules } from "../lib/helpers";

const { TextArea: Textarea } = Input;

const Text = (props) => {

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
        name={props.name}
        initialValue={props.value}
        rules={rules}
      >
        <Textarea
            disabled={props.readonly}
            placeholder={props.options.placeholder}
            rows={props.row}
            className={props.readonly && "readOnly"}
        />
      </Form.Item>
    </>
  );
};

export default Text;
