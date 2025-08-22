import { Form, Switch, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";

const SwitchIndex = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    return (
      <>
        {props.hideLable ?? <div>{props.display}</div>}
        <div className="read-only__value">
          {props.value ? <CheckOutlined /> : <CloseOutlined />}
        </div>
      </>
    );
  }

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
        <Switch
          {...props}
          onChange={props.onChange}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
        />
      </Form.Item>
    </>
  );
};

export default SwitchIndex;
