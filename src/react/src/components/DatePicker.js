import { Form, DatePicker } from "antd";
import { separationRules } from "../lib/helpers";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Text = (props) => {
  const dateFormat = props.options?.dateFormat
    ? props.options.dateFormat
    : "YYYY-MM-DD";

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  return (
    <>
      <Form.Item
        label={props.label}
        name={props.name}
        initialValue={
          props.value ? dayjs(props.value, dateFormat) : props.value
        }
        rules={rules}
        format={dateFormat}
      >
        <DatePicker
          format={dateFormat}
          placeholder={props.options.placeholder}
          disabled={props.readonly}
          className={`${props.readonly && "readOnly"} w-full`}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </>
  );
};

export default Text;
