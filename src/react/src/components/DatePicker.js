
import { Form, DatePicker } from "antd";

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
        <DatePicker />
      </Form.Item>
    </>
  );
};

export default Text;
