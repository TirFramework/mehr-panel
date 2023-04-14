import { Form, DatePicker } from "antd";
import { separationRules } from "../lib/helpers";
import moment from "moment";

const Date = (props) => {
  const options = {
    style: { width: "100%" },
  };
  if (props.options.picker) {
    options.picker = props.options.picker;
  }
  return (
    <DatePicker
      format={props.dateFormat}
      placeholder={props.options.placeholder}
      disabled={props.readonly}
      value={props.value ? moment(props.value, props.dateFormat) : props.value}
      className={`${props.readonly && "readOnly"} w-full`}
      onChange={(e, v) => {
        props.onChange(v);
      }}
      {...options}
    />
  );
};

const Text = (props) => {
  const dateFormat = props.options.dateFormat
    ? props.options.dateFormat
    : "YYYY-MM-DD";
  // const stillUtc = moment.utc(props.value);
  // // const local = moment(stillUtc).local();
  // console.log("🚀 ~ file: DatePicker.js:22 ~ Text ~ local:", stillUtc);

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
        rules={rules}
        format={dateFormat}
      >
        <Date dateFormat={dateFormat} {...props} />
      </Form.Item>
    </>
  );
};

export default Text;
