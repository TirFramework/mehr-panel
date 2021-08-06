
import { Form, DatePicker } from "antd";

const { RangePicker } = DatePicker;


const Text = (data) => {
  return (
    <>
      <Form.Item
        label={data.label}
        name={data.name}
        initialValue={data.val}
        rules={[
          {
            required: true,
            // message: "Please input your username!",
          },
        ]}
      >
        <RangePicker />
      </Form.Item>
    </>
  );
};

export default Text;
