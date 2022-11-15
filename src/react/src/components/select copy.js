import React, { useState, useEffect } from "react";
import { Empty, Form, Select, Spin } from "antd";
// import debounce from "lodash/debounce";

import {
  separationRules,
  // removeBaseUrl
} from "../lib/helpers";
import * as api from "../api";
const { Option } = Select;

const Text = (props) => {
  // const [value, setValue] = useState([]);

  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState(() => {
    if (props.data === undefined) {
      return [
        {
          value: 0,
          text: "test",
        },
      ];
    } else {
      return [props.data];
    }
  });

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });
  // console.log("🚀 ~ file: Select.js ~ line 68 ~ Text ~ rules", rules);

  const getOptions = (q = "") => {
    setLoading(true);
    // console.log("🚀 ~ file: Select.js ~ line 96 ~ getOptions ~ q", q);
    api.getSelect(props.dataUrl, q).then((res) => {
      console.log("🚀 ~ file: Select.js ~ line 69 ~ .then ~ data", res.data);
      // setOptions(data.data.concat(props.data));
      let newOption = res.data.map((item) => ({
        label: item.text,
        value: item.value,
      }));

      props.data.map((item) =>
        newOption.push({
          label: item.text,
          value: item.value,
        })
      );

      console.log(
        "🚀 ~ file: Select.js ~ line 52 ~ api.getSelect ~ newOption",
        newOption
      );
      setOptions(newOption);
      setLoading(false);
    });
  };

  useEffect(() => {
    console.log("🚀 ~ file: Select.js ~ line 56 ~ useEffect ~ props", props);
    if (props.dataUrl) {
      getOptions();
    }
  }, [props]);

  if (!props.dataUrl) {
    return (
      <>
        <Form.Item
          name={props.name.split("+")}
          label={props.display}
          initialValue={props.value}
          rules={rules}
        >
          <Select
            notFoundContent={
              loading ? (
                <Spin size="small" />
              ) : (
                <Empty imageStyle={{ height: 250 }} />
              )
            }
            mode={props.multiple ? "multiple" : false}
            allowClear
          >
            {options.map((d, index) => (
              <Option key={index} value={d.value}>
                {d.text}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    );
  } else {
    return (
      <>
        <Form.Item
          name={props.name.split("+")}
          label={props.display}
          initialValue={props.value}
          rules={rules}
        >
          <Select
            onSearch={(q) => getOptions(q)}
            allowClear
            showSearch
            loading={loading}
            // notFoundContent={loading ? <Spin size="small" /> : <Empty imageStyle={{ height: 250 }} />}
            filterOption={false}
            options={options}
            mode={props.multiple ? "multiple" : false}
          ></Select>
        </Form.Item>
        {/* <div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          {options.map((d, index) => (
            <div>{d.label}</div>
          ))}
        </div> */}
      </>
    );
  }
};

export default Text;
