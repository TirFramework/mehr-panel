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

// Map از component های موجود برای دسترسی سریع
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

// نگهداری lazy components (نه cache، فقط برای جلوگیری از re-creation)
const lazyFields = {};

// استفاده از import.meta.glob برای پشتیبانی امن از dynamic import توسط Vite
// همه فایل‌های jsx موجود در همین دایرکتوری (به‌جز خود Field.jsx) را map می‌کنیم
const dynamicFieldModules = import.meta.glob(["./*.jsx", "!./Field.jsx"]);

const Field = (props) => {
  if (props.existent === false) {
    return null;
  }

  const type  = props.type;

  // اگر type در map موجود باشد، مستقیماً از آن استفاده می‌کنیم
  if (fieldComponents[type]) {
    const Component = fieldComponents[type];
    return <Component {...props} />;
  }

  // اگر type در map نباشد، از lazy import استفاده می‌کنیم
  // فقط یک بار برای هر type ساخته می‌شود
  if (!lazyFields[type]) {
    const key = `./${type}.jsx`;
    const loader = dynamicFieldModules[key];
    if (loader) {
      lazyFields[type] = lazy(() =>
        loader().then((mod) => ({ default: mod.default })).catch((error) => {
          console.error(`❌ خطا در بارگذاری component ${type}.jsx:`, error);
          return { default: () => <div>Error loading the field: {type}</div> };
        })
      );
    } else {
      // اگر ماژول موجود نبود، یک کامپوننت خطا برگردانیم
      lazyFields[type] = () => <div>Error loading the field: {type}</div>;
    }
  }

  const DynamicField = lazyFields[type];

  // Fallback برای Group
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

