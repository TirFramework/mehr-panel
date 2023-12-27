import { Form, ColorPicker as AntdColorPicker } from "antd";

import { separationRules } from "../lib/helpers";
<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
>>>>>>> b422e49e3db751c47aa39210108024a1b841d337

const ColorPicker = (props) => {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  return (
    <>
      <Form.Item
        label={props.display}
        name={props.name}
        initialValue={props.value}
        rules={rules}
      >
        <MyColorPicker {...props} />
      </Form.Item>
    </>
  );
};

export default ColorPicker;

const MyColorPicker = (props) => {
  return (
    <>
      <AntdColorPicker
        disabled={props.readonly}
        value={props.value}
        onChange={(val) => {
          props.onChange(
            `rgba(${val?.metaColor.r},${val?.metaColor.g},${val?.metaColor.r}, ${val?.metaColor.a})`
          );
        }}
      />
    </>
  );
};
