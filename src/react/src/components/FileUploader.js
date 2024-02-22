// // import { Form, Button, Upload, Card } from "antd";
// // import { UploadOutlined } from "@ant-design/icons";
// // import { useState } from "react";

// // const normFile = (e) => {
// //   console.log("Upload event:", e);

// //   return e.fileList;
// // };

// // const Demo = () => {
// //   return (
// //     <Form.Item
// //       name="upload"
// //       label="Upload"
// //         valuePropName="fileList"
// //         getValueFromEvent={normFile}
// //         initialValue={[
// //           {
// //             url: "http://www.baidu.com/xxx.png222",
// //           },
// //         ]}
// //     >
// //       <Upload
// //         action="/upload.do"
// //         maxCount={1}
// //         listType="picture"
// //       >
// //         <Button icon={<UploadOutlined />}>Click to upload</Button>
// //       </Upload>
// //     </Form.Item>
// //   );
// // };
// // export default Demo;

import React, { useState, useCallback } from "react";
import { Upload, Button, Tooltip, Form } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { UploadOutlined } from "@ant-design/icons";

import { getAccept, separationRules } from "../lib/helpers";

import Cookies from "js-cookie";

import Config from "../constants/config";

const type = "DragableUploadList";

const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
  const ref = React.useRef();
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  const errorNode = (
    <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
  );
  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ""
      }`}
      style={{ cursor: "move" }}
    >
      {file.status === "error" ? errorNode : originNode}
    </div>
  );
};

const DragSortingUpload = (props) => {
  const initialValueHandeling = (data) => {
    let newData = [];
    if (data === undefined || data === null) {
      return null;
    }
    if (!Array.isArray(data)) {
      newData.push({
        uid: 1,
        name: data,
        value: `${data}`,
        url: `${props.basePath}/${data}`,
      });
    } else {
      newData = data.map((item, index) => ({
        uid: index,
        name: item,
        value: `${item}`,
        url: `${props.basePath}/${item}`,
      }));
    }
    return newData;
  };

  const [fileList, setFileList] = useState(initialValueHandeling(props.value));

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = fileList[dragIndex];
      setFileList(
        update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
      props.onChange(
        update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [fileList]
  );

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    props.onChange(newFileList);
  };

  const token = Cookies.get("api_token");

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Upload
          accept={getAccept([props.fileRules])}
          action={props.postUrl}
          headers={{ Authorization: `Bearer ${token}` }}
          // defaultFileList={initialValueHandeling(props.value)}
          fileList={fileList}
          listType="picture"
          maxCount={props.maxCount}
          onChange={onChange}
          disabled={props.readonly}
          className={props.readonly ? "readOnly" : " "}
          //   {...props}
          itemRender={(originNode, file, currFileList) => (
            <DragableUploadListItem
              originNode={originNode}
              file={file}
              fileList={currFileList}
              moveRow={moveRow}
            />
          )}
        >
          <Button icon={<UploadOutlined />}>
            Click to upload file for {props.display}
          </Button>
        </Upload>
      </DndProvider>
    </>
  );
};

const CustomUpload = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const normFile = (e) => {
    // return e.fileList
    if (e.length === 1) {
      if (e[0].response !== undefined) {
        return `${e[0].response.path}`;
      }
      if (e[0].value !== undefined) {
        return `${e[0].value}`;
      }
    }
    return e.map((item) => {
      if (item.response !== undefined) {
        return `${item.response.path}`;
      }
      if (item.value !== undefined) {
        return `${item.value}`;
      }
    });
  };
  return (
    <Form.Item
      name={props.name}
      // valuePropName="fileList"
      initialValue={props.value || props.defaultValue}
      rules={rules}
      getValueFromEvent={normFile}
      // setFieldsValue={fileList}
    >
      <DragSortingUpload {...props} />
    </Form.Item>
  );
};
export default CustomUpload;

// import { Form, Upload, message, Button } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const CustomUpload = (props) => {

//   const initialValueHandeling = (data) => {
//     let newData = [];
//     if (!Array.isArray(data)) {
//       newData.push({
//         url: `${Config.storage}/${data}`
//       });
//     } else {
//       newData.push(
//         data.map((item) => ({
//           url: `${Config.storage}/${item}`,
//         }))
//       );
//     }
//     console.log("🚀 ~ file: FileUploader.js ~ line 251 ~ change ~ newData", newData)
//     return newData;
//   };

//   const attr = {
//     name: "file",
//     maxCount: 1,
//     action: "${Config.apiBaseUrl}/api/v1/admin/file-manager/upload",
//     headers: {
//       Authorization: `Bearer a`,
//     },

//     // defaultFileList:[{
//     //   url: '${Config.storage}/2021/09/AlLPRUuPrQ6henfApCaZuk1BLt1aMnmbUK4Rbzc8.png'
//     // }],
//     listType: "picture",
//     defaultFileList: initialValueHandeling(props.value),
//     onChange(info) {
//       console.log("--------------------------- on change", info);
//       // if (info.file.status !== 'uploading') {
//       //   console.log(info.file, info.fileList);
//       // }
//       // if (info.file.status === 'done') {
//       //   message.success(`${info.file.name} file uploaded successfully`);
//       // } else if (info.file.status === 'error') {
//       //   message.error(`${info.file.name} file upload failed.`);
//       // }
//     },
//   };

//   const normFile = (e) => {
//     console.log("Upload event:", e);
//     console.log("Upload event response:", e.fileList);
//     // return e.fileList

//     if(e.fileList.length === 1){
//       if (e.fileList[0].response !== undefined) {
//         return e.fileList[0].response.path
//       }
//     }
//     return e.fileList.map((item) => {
//       if (item.response !== undefined) {
//         return item.response.path;
//       }
//     });
//   };

//   return (
//     <Form.Item
//       name={props.name}
//       label={props.display}
//       // valuePropName="path"
//       // valuePropName="fileList"
//       initialValue={ props.value }
//       getValueFromEvent={normFile}
//       // setFieldsValue={fileList}
//     >
//       <Upload {...attr}>
//         <Button icon={<UploadOutlined />}>Click to Upload</Button>
//       </Upload>
//     </Form.Item>
//   );
// };

// export default CustomUpload;
