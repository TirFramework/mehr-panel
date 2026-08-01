import React, { useState, useCallback } from "react";
import { Upload, Button, Tooltip, Space } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import {
  FileOutlined,
  InboxOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { getAccept, separationRules } from "../lib/helpers";
import { LabeledFormItem, fieldCommentTooltip } from "../lib/fieldLabel";
import { getApiToken } from "../lib/authToken";
import { useLanguage } from "../context/LanguageContext";
import { renderAddonContent } from "./InputAddon";

const type = "DragableUploadList";

function normalizeFieldOptions(options) {
  let opts = options;
  if (!opts) return {};
  for (let i = 0; i < 2 && typeof opts === "string"; i += 1) {
    try {
      opts = JSON.parse(opts);
    } catch {
      return {};
    }
  }
  if (opts && typeof opts === "object" && !Array.isArray(opts)) {
    return opts;
  }
  return {};
}

function isOptionEnabled(value) {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  if (typeof value === "string" && value.toLowerCase() === "true") {
    return true;
  }
  return false;
}

/** options.dragAndDrop / options.dragger → show Upload.Dragger drop zone */
function resolveDragAndDrop(options) {
  const opts = normalizeFieldOptions(options);
  return isOptionEnabled(opts.dragAndDrop) || isOptionEnabled(opts.dragger);
}

/** options.avatar → circular single-image uploader */
function resolveAvatar(options) {
  const opts = normalizeFieldOptions(options);
  return isOptionEnabled(opts.avatar);
}

/** options.icon / options.dragIcon → custom SVG (or node) for Dragger */
function resolveDragIcon(options) {
  const opts = normalizeFieldOptions(options);
  const custom = opts.icon ?? opts.dragIcon;
  if (custom == null || custom === "") {
    return <InboxOutlined />;
  }
  const rendered = renderAddonContent(custom);
  return rendered ?? <InboxOutlined />;
}

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
  const { t } = useLanguage();
  const avatar = resolveAvatar(props.options);
  const dragAndDrop = !avatar && resolveDragAndDrop(props.options);
  const maxCount = avatar
    ? Number(props.maxCount) > 0
      ? Number(props.maxCount)
      : 1
    : props.maxCount;

  const initialValueHandeling = (data) => {
    if (data === undefined || data === null || data === "") {
      return [];
    }
    // Ignore in-progress / invalid form values like [undefined]
    if (Array.isArray(data)) {
      return data
        .filter((item) => item != null && item !== "")
        .map((item, index) => {
          if (typeof item === "object") {
            return {
              uid: item.uid ?? index,
              name: item.name ?? item.value ?? String(index),
              status: item.status ?? "done",
              value: item.value ?? item.response?.path,
              url:
                item.url ??
                (item.value || item.response?.path
                  ? `${props.basePath}/${item.value || item.response?.path}`
                  : undefined),
              response: item.response,
              thumbUrl: item.thumbUrl,
              originFileObj: item.originFileObj,
            };
          }
          return {
            uid: index,
            name: String(item),
            status: "done",
            value: `${item}`,
            url: `${props.basePath}/${item}`,
          };
        });
    }
    return [
      {
        uid: 1,
        name: String(data),
        status: "done",
        value: `${data}`,
        url: `${props.basePath}/${data}`,
      },
    ];
  };

  const [fileList, setFileList] = useState(() =>
    initialValueHandeling(props.value)
  );
  const isInternalChange = React.useRef(false);

  React.useEffect(() => {
    if (!isInternalChange.current) {
      setFileList(initialValueHandeling(props.value));
    }
    isInternalChange.current = false;
  }, [props.value]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const list = Array.isArray(fileList) ? fileList : [];
      const dragRow = list[dragIndex];
      const newFileList = update(list, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });
      setFileList(newFileList);
      isInternalChange.current = true;
      props.onChange?.(newFileList);
    },
    [fileList, props]
  );

  const onChange = (info) => {
    const nextList = Array.isArray(info?.fileList) ? info.fileList : [];
    setFileList(nextList);
    isInternalChange.current = true;
    props.onChange?.(nextList);
  };

  const token = getApiToken();
  const uploadHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const accept = getAccept(
    Array.isArray(props.fileRules) ? props.fileRules : [props.fileRules]
  );

  const list = Array.isArray(fileList) ? fileList : [];

  const sharedUploadProps = {
    "data-cy": props.testId,
    accept: accept || undefined,
    action: props.postUrl,
    headers: uploadHeaders,
    fileList: list,
    listType: avatar ? "picture-circle" : "picture",
    maxCount,
    onChange,
    disabled: props.disable,
    className: props.readonly
      ? "readOnly"
      : avatar
        ? "mp-upload-avatar"
        : dragAndDrop
          ? "mp-upload-dragger"
          : " ",
  };

  // List reordering uses react-dnd HTML5Backend, which can block native file
  // drops — only enable it for the button uploader (not avatar / dragger).
  if (!dragAndDrop && !avatar) {
    sharedUploadProps.itemRender = (originNode, file, currFileList) => (
      <DragableUploadListItem
        disabled={props.disable}
        originNode={originNode}
        file={file}
        fileList={Array.isArray(currFileList) ? currFileList : []}
        moveRow={moveRow}
      />
    );
  }

  const avatarTrigger = (
    <div className="mp-upload-avatar__trigger">
      <PlusOutlined />
      <div className="mp-upload-avatar__hint">{t.AVATAR_CLICK_TO_UPLOAD}</div>
    </div>
  );

  const uploadControl = avatar ? (
    <Upload {...sharedUploadProps}>
      {list.length >= (maxCount || 1) ? null : avatarTrigger}
    </Upload>
  ) : dragAndDrop ? (
    <Upload.Dragger {...sharedUploadProps}>
      <p className="ant-upload-drag-icon">{resolveDragIcon(props.options)}</p>
      <p className="ant-upload-text">{t.UPLOAD_DRAG_TEXT}</p>
      <p className="ant-upload-hint">{t.UPLOAD_DRAG_HINT}</p>
    </Upload.Dragger>
  ) : (
    <Upload {...sharedUploadProps}>
      <Button
        icon={<UploadOutlined />}
        disabled={props.disable}
        data-cy={`${props.testId}-button`}
      >
        {(t.UPLOAD_CLICK_FOR || "").replace("{display}", props.display)}
      </Button>
    </Upload>
  );

  if (dragAndDrop || avatar) {
    return uploadControl;
  }

  return <DndProvider backend={HTML5Backend}>{uploadControl}</DndProvider>;
};

const ReadonlyFileUploader = ({ value, basePath, display, avatar }) => {
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
    const size = avatar ? 96 : 45;
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className={avatar ? "mp-upload-avatar__readonly" : undefined}
        style={{ cursor: "pointer" }}
      >
        <img
          src={fileUrl}
          alt={display}
          width={size}
          height={size}
          style={{
            objectFit: "cover",
            borderRadius: avatar ? "50%" : undefined,
          }}
        />
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
  const avatar = resolveAvatar(props.options);

  const normFile = (e) => {
    const list = Array.isArray(e) ? e : e?.fileList;
    if (!Array.isArray(list)) {
      return Number(props.maxCount) === 1 || avatar ? undefined : [];
    }

    const toPath = (item) => {
      if (item == null) return undefined;
      if (item.response?.path != null && item.response.path !== "") {
        return String(item.response.path);
      }
      if (item.value != null && item.value !== "") {
        return String(item.value);
      }
      return undefined;
    };

    if (Number(props.maxCount) === 1 || avatar) {
      const path = toPath(list[0]);
      // While uploading, keep fileList in form so antd never gets null/undefined
      return path !== undefined ? path : list;
    }

    const paths = list.map(toPath);
    const allReady = list.every((_, i) => paths[i] !== undefined);
    return allReady ? paths : list;
  };

  if (props.readonly) {
    const placeholder = normalizeFieldOptions(props.options)?.placeholder;

    if (Array.isArray(props.value)) {
      if (props.value.length === 0) {
        return placeholder ? (
          <ReadonlyFileUploader
            value={placeholder}
            basePath={props.basePath}
            display={props.display}
            avatar={avatar}
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
              avatar={avatar}
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
        avatar={avatar}
      />
    );
  }

  return (
    <LabeledFormItem
      name={props.name}
      display={props.display}
      hideLabel={props.hideLabel}
      inlineLabel={props.inlineLabel}
      options={props.options}
      tooltip={fieldCommentTooltip(props.comment)}
      initialValue={props.value || defaultValue}
      rules={rules}
      getValueFromEvent={normFile}
    >
      <DragSortingUpload {...props} />
    </LabeledFormItem>
  );
};

export default CustomUpload;
