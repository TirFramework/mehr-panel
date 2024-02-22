import { memo, lazy, Suspense } from "react";
import { Card, Checkbox, Form, Input, Skeleton } from "antd";
import Submit from "./Submit";
import Cancel from "./Cancel";
import Additional from "./Additional";
import Blank from "./Blank";
import Button from "./Button";
import Group from "./Group";
import Text from "./Text";
import ColorPicker from "./ColorPicker";
import DatePicker from "./DatePicker";
import FileUploader from "./FileUploader";
import Icon from "./Icon";
import Link from "./Link";
import Number from "./Number";
import Password from "./Password";
import Radio from "./Radio";
import RangePicker from "./RangePicker";
import Select from "./Select";
import Slug from "./Slug";
import Switch from "./Switch";
import Textarea from "./Textarea";
import Editor from "./Editor";
import Render from "../blocks/Render";

// const DynamicField = (props) => {
//   const F = lazy(() => import(`./${props.type}.js`));
//   return <F {...props} />;
// };

const Field = (props) => {
  const DynamicField = lazy(() =>
    import(`./${props.type}`).catch((error) => {
      return { default: () => <div>Error loading the field.</div> };
    })
  );
  return (
    <Suspense
      fallback={
        <div>
          {props.type == "Group" ? (
            <Card title={props.display}>
              {props.children.map((field, index) => (
                <Form.Item label={field.display} key={index}>
                  <input placeholder="loading..." className="ant-input" />
                </Form.Item>
              ))}
            </Card>
          ) : (
            <></>
          )}
        </div>
      }
    >
      {props.type === "Group" ? (
        <Group {...props} />
      ) : props.type === "Cancel" ? (
        <Cancel {...props} />
      ) : props.type === "Submit" ? (
        <Submit {...props} />
      ) : props.type === "Additional" ? (
        <Additional {...props} />
      ) : props.type === "Icon" ? (
        <Icon {...props} />
      ) : props.type === "Link" ? (
        <Link {...props} />
      ) : props.readonly && !props.custom ? (
        <Render {...props} />
      ) : props.type === "Text" ? (
        <Text {...props} />
      ) : props.type === "ColorPicker" ? (
        <ColorPicker {...props} />
      ) : props.type === "Blank" ? (
        <Blank {...props} />
      ) : props.type === "Button" ? (
        <Button {...props} />
      ) : props.type === "Checkbox" ? (
        <Checkbox {...props} />
      ) : props.type === "DatePicker" ? (
        <DatePicker {...props} />
      ) : props.type === "Editor" ? (
        <Editor {...props} />
      ) : props.type === "FileUploader" ? (
        <FileUploader {...props} />
      ) : props.type === "Number" ? (
        <Number {...props} />
      ) : props.type === "Password" ? (
        <Password {...props} />
      ) : props.type === "Radio" ? (
        <Radio {...props} />
      ) : props.type === "RangePicker" ? (
        <RangePicker {...props} />
      ) : props.type === "Select" ? (
        <Select {...props} />
      ) : props.type === "Slug" ? (
        <Slug {...props} />
      ) : props.type === "Switch" ? (
        <Switch {...props} />
      ) : props.type === "Textarea" ? (
        <Textarea {...props} />
      ) : (
        <DynamicField
          type={props.type}
          {...props}
          // showInIndex={props.id != pageId}
        />
      )}
    </Suspense>
  );
};

export default memo(Field);
