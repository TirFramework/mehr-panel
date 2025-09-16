import { useEffect } from "react";
import { Form, Input, Popover, Space, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";

const Text = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });
  // استفاده از یک متغیر برای ذخیره خروجی قبل از return

  if (props.readonly) {
    // نمایش برچسب اگر hideLable false باشد
    const label = props.hideLable ? null : <div>{props.display}</div>;

    // مدیریت نمایش prop.value
    let valueContent;
    if (Array.isArray(props.value)) {
      // اگر یک آرایه بود، تگ‌ها را نمایش بده
      valueContent = props.value.map((val, index) => (
        <Tag key={index}>{val}</Tag>
      ));
    } else if (props.value === null) {
      // اگر null بود، چیزی نمایش نده
      valueContent = null;
    } else {
      // در غیر این صورت، مقدار را به صورت عادی نمایش بده
      valueContent = props.value;
    }

    // خروجی نهایی
    return (
      <>
        {label}
        {valueContent}
      </>
    );
  }

  // ... بقیه کد
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
          {...props.options}
          placeholder={props.placeholder || props.options.placeholder}
          disabled={props.disable}
        />
      </Form.Item>
    </>
  );
};

export default Text;
