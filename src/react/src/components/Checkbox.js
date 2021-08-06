
import { Form, Checkbox } from "antd";

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
        <Checkbox />
      </Form.Item>
    </>
  );
};

export default Text;
