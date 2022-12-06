import { Form, Checkbox } from "antd";
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
        valuePropName="checked"
        rules={rules}
        labelCol={{
          flex: "none",
        }}
        wrapperCol={{
          flex: "auto",
        }}
      >
        <Checkbox
          onChange={props.onChange}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
        />
      </Form.Item>
    </>
  );
};

export default Text;
