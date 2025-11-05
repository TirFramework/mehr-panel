import { useEffect } from "react";
import { Form, Input, Popover, Space, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";
import Readonly from "../blocks/Readonly";

const Text = ({
  defaultValue,
  pageType,
  rules,
  creationRules,
  updateRules,
  readonly,
  hideLable,
  display,
  comment,
  name,
  options,
  placeholder,
  disable,
  value,
  ...props
}) => {
  const formRules = separationRules({
    pageType: pageType,
    rules: rules,
    creationRules: creationRules,
    updateRules: updateRules,
  });
  // استفاده از یک متغیر برای ذخیره خروجی قبل از return

  if (readonly) {
    // نمایش برچسب اگر hideLable false باشد
    const label = hideLable ? null : <div>{display}</div>;

    // مدیریت نمایش prop.value
    let valueContent;
    if (Array.isArray(value)) {
      // اگر یک آرایه بود، تگ‌ها را نمایش بده
      valueContent = value.map((val, index) => <Tag key={index}>{val}</Tag>);
    } else if (value === null) {
      // اگر null بود، چیزی نمایش نده
      valueContent = null;
    } else {
      // در غیر این صورت، مقدار را به صورت عادی نمایش بده
      valueContent = value;
    }

    // خروجی نهایی
    return (
      <Readonly>
        {label}
        {valueContent}
      </Readonly>
    );
  }

  // ... بقیه کد
  return (
    <>
      <Form.Item
        label={
          <Space>
            {display}
            {comment?.content !== undefined && (
              <Popover content={comment.content} title={comment.title}>
                <QuestionCircleOutlined />
              </Popover>
            )}
          </Space>
        }
        name={name}
        initialValue={props.value || defaultValue}
        rules={formRules}
      >
        <Input
          {...props.options}
          placeholder={placeholder || options.placeholder}
          disabled={props.disable}
        />
      </Form.Item>
    </>
  );
};

export default Text;
