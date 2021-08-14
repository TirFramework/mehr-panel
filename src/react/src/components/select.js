import { Form, Select } from "antd";

const { Option } = Select;



const Text = (data) => {
// console.log("🚀 ~ file: Select.js ~ line 8 ~ Text ~ data", data.data)

const options = data.data.map((d, index) => <Option key={index} value={d.value}>{d.text}</Option>);
// 
// const options = Object.entries(data.data).forEach(([key, value]) => <Option>{key}</Option> ); 
// const options =  Object.entries(data.data).forEach( ([key, value]) => key ); // "foo: bar", "baz: 42"


// console.log("🚀 ~ file: Select.js ~ line 12 ~ Text ~ options", options)


  return (
    <>
      <Form.Item
        name={data.name}
        label={data.display}
        // valuePropName="option"
        initialValue={data.value}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          allowClear
        >
            {options}
        </Select>
      </Form.Item>
    </>
  );
};

export default Text;
