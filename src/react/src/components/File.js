// import { Upload, message, Button } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';

// const props = {
//   name: 'file',
//   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//   headers: {
//     authorization: 'authorization-text',
//   },
//   onChange(info) {
//     if (info.file.status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
// };

// ReactDOM.render(
//   <Upload {...props}>
//     <Button icon={<UploadOutlined />}>Click to Upload</Button>
//   </Upload>,
//   mountNode,
// );



import { Form, Button, Upload } from "antd";

import { UploadOutlined } from '@ant-design/icons';

const normFile = (e) => {
  // console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const Text = (data) => {
  return (
    <>
    <Form.Item
        name="upload"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="longgggggggggggggggggggggggggggggggggg"
      >
        <Upload name="logo" action="/upload.do" listType="text">
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default Text;

