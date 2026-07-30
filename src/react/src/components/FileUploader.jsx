import React, { useState, useCallback } from "react";
import { Upload, Button, Tooltip, Form, Space, Popover } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import { FileOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";

import { getAccept, separationRules } from "../lib/helpers";
import { formItemLabelProps } from "../lib/fieldLabel";
import { getApiToken } from "../lib/authToken";
import { useLanguage } from "../context/LanguageContext";

const fieldCommentTooltip = (comment) => {
  if (comment?.content === undefined) {
    return undefined;
  }

  return {
    title: (
      <>
        {comment.title ? <div>{comment.title}</div> : null}
        <div>{comment.content}</div>
      </>
    ),
    icon: <QuestionCircleOutlined />,
  };
};

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
      className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ""
        }`}
      style={{ cursor: "move" }}
    >
      {file.status === "error" ? errorNode : originNode}
    </div>
  );
};

const DragSortingUpload = (props) => {
  const { t } = useLanguage();
  const initialValueHandeling = (data) => {
    let newData = [];
    if (data === undefined || data === null) {
      return [];
    }
    if (!Array.isArray(data)) {
      newData.push({
        uid: 1,
        name: data,
        status: "done",
        value: `${data}`,
        url: `${props.basePath}/${data}`,
      });
    } else {
      newData = data.map((item, index) => ({
        uid: index,
        name: item,
        status: "done",
        value: `${item}`,
        url: `${props.basePath}/${item}`,
      }));
    }
    return newData;
  };

  const [fileList, setFileList] = useState(initialValueHandeling(props.value));
  const isInternalChange = React.useRef(false);

  React.useEffect(() => {
    if (!isInternalChange.current) {
      setFileList(initialValueHandeling(props.value));
    }
    isInternalChange.current = false;
  }, [props.value]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = fileList[dragIndex];
      const newFileList = update(fileList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });
      setFileList(newFileList);
      isInternalChange.current = true;
      props.onChange(newFileList);
    },
    [fileList, props]
  );

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    isInternalChange.current = true;
    props.onChange(newFileList);
  };

  const token = getApiToken();
  const uploadHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Upload
          data-cy={props.testId}
          accept={getAccept([props.fileRules])}
          action={props.postUrl}
          headers={uploadHeaders}
          fileList={fileList}
          listType="picture"
          maxCount={props.maxCount}
          onChange={onChange}
          disabled={props.disable}
          className={props.readonly ? "readOnly" : " "}
          itemRender={(originNode, file, currFileList) => (
            <DragableUploadListItem
              disabled={props.disable}
              originNode={originNode}
              file={file}
              fileList={currFileList}
              moveRow={moveRow}
            />
          )}
        >
          <Button icon={<UploadOutlined />} disabled={props.disable} data-cy={`${props.testId}-button`}>
            {(t.UPLOAD_CLICK_FOR || "").replace("{display}", props.name)}
          </Button>
        </Upload>
      </DndProvider>
    </>
  );
};



const ReadonlyFileUploader = ({ value, basePath, display }) => {
  if (!value) {
    return null;
  }

  const fileUrl = `${basePath}/${value}`;

  const isPicture =
    value.includes(".png") ||
    value.includes(".jpg") ||
    value.includes(".jpeg") ||
    value.includes(".gif") ||
    value.includes(".svg") ||
    value.includes(".webp");

  if (isPicture) {
    return (
      <a href={fileUrl} target="_blank" rel="noreferrer" style={{ cursor: "pointer" }}>
        <img src={fileUrl} alt={display} width={45} height={45} style={{ objectFit: "cover" }} />
      </a>
    );
  }

  return (
    <a href={fileUrl} target="_blank" rel="noreferrer">
      <FileOutlined />
    </a>
  );
};



const CustomUpload = ({ defaultValue, ...props }) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const normFile = (e) => {
    if (props.maxCount === 1) {
      if (e.length === 1) {
        if (e[0].response !== undefined) {
          return `${e[0].response.path}`;
        }
        if (e[0].value !== undefined) {
          return `${e[0].value}`;
        }
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


  if (props.readonly) {
    const placeholder = props.options?.placeholder;

    if (Array.isArray(props.value)) {
      if (props.value.length === 0) {
        return placeholder ? (
          <ReadonlyFileUploader
            value={placeholder}
            basePath={props.basePath}
            display={props.display}
          />
        ) : (
          <div>No Found</div>
        );
      }
      return (
        <Space wrap>
          {props.value.map((item, index) => (
            <ReadonlyFileUploader
              key={`${item}-${index}`}
              value={item}
              basePath={props.basePath}
              display={props.display}
            />
          ))}
        </Space>
      );
    }
    return (
      <ReadonlyFileUploader
        value={props.value || placeholder}
        basePath={props.basePath}
        display={props.display}
      />
    );
  }

  return (
    <Form.Item
      name={props.name}
      {...formItemLabelProps({
        display: props.display,
        hideLabel: props.hideLabel,
        options: props.options,
      })}
      tooltip={fieldCommentTooltip(props.comment)}
      initialValue={props.value || defaultValue}
      rules={rules}
      getValueFromEvent={normFile}
    >
      <DragSortingUpload {...props} />
    </Form.Item>
  );
};



export default CustomUpload;
