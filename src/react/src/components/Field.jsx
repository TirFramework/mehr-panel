import React, { memo, lazy, Suspense } from "react";
import { Card, Form } from "antd";
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
import Checkbox from "./Checkbox";
import SaveAndClose from "./SaveAndClose";

// Map of built-in components for fast lookup
const fieldComponents = {
  Group,
  Cancel,
  Submit,
  SaveAndClose,
  Additional,
  Link,
  Text,
  ColorPicker,
  Blank,
  Button,
  Checkbox,
  DatePicker,
  Editor,
  FileUploader,
  Number,
  Password,
  Radio,
  RangePicker,
  Select,
  Slug,
  Switch,
  Textarea,
};

// Hold lazy components (not a cache; only prevents re-creation)
const lazyFields = {};

// Use import.meta.glob for safe dynamic imports with Vite
// Map all jsx files in this directory (except Field.jsx itself)
const dynamicFieldModules = import.meta.glob(["./*.jsx", "!./Field.jsx"]);

const Field = (props) => {
  if (props.existent === false) {
    return null;
  }

  const { type } = props;

  // If type exists in the map, use it directly
  if (fieldComponents[type]) {
    const Component = fieldComponents[type];
    return <Component {...props} />;
  }

  // If type is not in the map, use lazy import
  // Created only once per type
  if (!lazyFields[type]) {
    const key = `./${type}.jsx`;
    const loader = dynamicFieldModules[key];
    if (loader) {
      lazyFields[type] = lazy(() =>
        loader().then((mod) => ({ default: mod.default })).catch((error) => {
          console.error(`❌ خطا در بارگذاری component ${type}.jsx:`, error);
          return { default: () => (
            <div className="field-load-error">Error loading the field: {type}</div>
          ) };
        })
      );
    } else {
      // If the module is missing, return an error component
      lazyFields[type] = () => (
        <div className="field-load-error">Error loading the field: {type}</div>
      );
    }
  }

  const DynamicField = lazyFields[type];

  // Fallback for Group
  const fallback =
    type === "Group" ? (
      <Card title={props.display}>
        {props.children?.map((field, index) => (
          <Form.Item label={field.display} key={index}>
            <input placeholder="loading..." className="ant-input" />
          </Form.Item>
        ))}
      </Card>
    ) : null;

  return (
    <Suspense fallback={fallback || <div></div>}>
      <DynamicField {...props} />
    </Suspense>
  );
};

export default memo(Field);

