
import { Form, Checkbox } from "antd";

const Text = (data) => {
  return (
    <>
      <Form.Item
        label={data.display}
        name={data.name}
        initialValue={data.value}
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
