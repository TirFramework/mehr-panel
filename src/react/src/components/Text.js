import { Form, Input, Popover, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

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
        label={
          <Space>
            {props.display}
            {props.comment?.content !== undefined && (
              <Popover
                content={"props.comment.content"}
                title={"props.comment.title"}
              >
                <QuestionCircleOutlined />
              </Popover>
            )}
          </Space>
        }
        name={props.name}
        initialValue={props.value}
        rules={rules}
      >
        <Input
          placeholder={props.options.placeholder}
          disabled={props.readonly}
          className={props.readonly && "readOnly"}
        />
      </Form.Item>
    </>
  );
};

export default Text;
