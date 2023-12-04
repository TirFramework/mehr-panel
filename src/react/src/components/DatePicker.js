import { Form, DatePicker } from "antd";
import { separationRules } from "../lib/helpers";
import dayjs from "dayjs";

const CustomDatePicker = ({ format, onChange, value, ...props }) => {
  let formattedValue = null;
  if (value) {
    if (props.enableTimezone) {
      formattedValue = dayjs(value);
    } else {
      formattedValue = dayjs(value, "YYYY-MM-DDTHH:mm:ss");
    }
  }

  return (
    <DatePicker
      {...props}
      format={format}
      onChange={(data) => {
        if (props.enableTimezone) {
          onChange(data ? dayjs(data) : null);
        } else {
          onChange(data ? dayjs(data).format("YYYY-MM-DDTHH:mm:ss") : null);
        }
      }}
      value={formattedValue}
    />
  );
};

const Text = (props) => {
  const dateFormat = props.options.dateFormat
    ? props.options.dateFormat
    : "YYYY-MM-DD";

  const picker = props.options.picker ? props.options.picker : "date";

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
        initialValue={props.value && dayjs(props.value)}
        rules={rules}
      >
        <CustomDatePicker
          format={
            !props.options?.showTime?.length
              ? dateFormat
              : dateFormat + " " + props.options.showTime
          }
          showTime={
            props.options?.showTime?.length
              ? { format: props.options.showTime }
              : false
          }
          placeholder={props.options.placeholder}
          disabled={props.readonly}
          picker={picker}
          className={`${props.readonly && "readOnly"} w-full`}
          style={{ width: "100%" }}
          enableTimezone={props.timezone[0]}
          timezone={props.timezone[1]}
        />
      </Form.Item>
    </>
  );
};

export default Text;
