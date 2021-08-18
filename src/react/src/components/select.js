import React, { useMemo, useState, useRef, useEffect } from "react";
import { Empty, Form, Select, Spin } from "antd";
import debounce from "lodash/debounce";

import { separationRules, removeBaseUrl } from "../lib/helpers";
import * as api from "../api";
const { Option } = Select;

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      filterOption={false}
      notFoundContent={
        fetching ? <Spin size="small" /> : <Empty imageStyle={{ height: 25 }} />
      }
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

async function fetchItemList( dataUrl , q = null) {
  console.log("fetching user", q);
  console.log("fetching user", dataUrl);

  dataUrl = removeBaseUrl(dataUrl);
  // console.log(
  //   "🚀 ~ file: Select.js ~ line 50 ~ fetchUserList ~ dataUrl",
  //   dataUrl
  // );

  return api.getSelect(dataUrl, q).then((data) => {
    console.log("🚀 ~ file: Select.js ~ line 69 ~ .then ~ data", data);
    return data.map((item) => ({
      label: item.text,
      value: item.value,
    }));
  });
}

const Text = (props) => {
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });
  // console.log("🚀 ~ file: Select.js ~ line 68 ~ Text ~ rules", rules);


  
  const getOptions = (q = '') => {
    console.log("🚀 ~ file: Select.js ~ line 96 ~ getOptions ~ q", q);
    api.getSelect(props.dataUrl, q).then((data) => {
      console.log("🚀 ~ file: Select.js ~ line 69 ~ .then ~ data", data);
      setOptions(data);
    });
  };

  useEffect(() => {
    if (props.dataUrl) {
      getOptions()
    }
  }, [])


  if (!props.dataUrl) {
    const options = props.data.map((d, index) => (
      <Option key={index} value={d.value}>
        {d.text}
      </Option>
    ));

    return (
      <>
        <Form.Item
          name={props.name}
          label={props.display}
          initialValue={props.value}
          rules={rules}
        >
          <Select allowClear>{options}</Select>
        </Form.Item>
      </>
    );
  } else {


    return (
      <Form.Item
        name={props.name}
        label={props.display}
        initialValue={props.value}
        rules={rules}
      >
        {/* <DebounceSelect
          showSearch
          mode={props.multiple ? "multiple" : false}
          // optionFilterProp="children"
          value={value}
          placeholder={props.placeholder}
          fetchOptions={(q) => fetchItemList(props.dataUrl, q)}
          onSearch={() => fetchItemList(props.dataUrl)}
          rules={rules}
          onChange={(newValue) => {
            return setValue(newValue);
          }}
          allowClear
        /> */}

        <Select
          onSearch={(q) => getOptions(q)}
          allowClear
          showSearch
          // options={options}
          filterOption={false}
        >

          {options.map((d, index) => (
            <Option key={index} value={d.value}>
              {d.text}
            </Option>
          ))}

        </Select>

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
        <br />
        <br />
        <br />
        <br />

        {options.map((d, index) => (
            <div key={index} value={d.value}>
              {d.text}
            </div>
          ))}
      </Form.Item>
    );
  }
};

export default Text;
