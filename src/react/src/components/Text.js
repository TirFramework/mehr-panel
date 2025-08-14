import { useEffect } from "react";
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

  if (props.readonly) {
    return (
      <>
        {props.hideLable ?? <div>{props.display}</div>}
        {props.value}
      </>
    );
  }

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
        <Input {...props.options} disabled={props.disabled} />
      </Form.Item>
    </>
  );
};

export default Text;
