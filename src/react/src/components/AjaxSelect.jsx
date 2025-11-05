import React from "react";
import { Form, Select, Spin } from "antd";
import debounce from "lodash/debounce";

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
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
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

async function fetchUserList(username) {
  return fetch("https://randomuser.me/api/?results=10")
    .then((response) => response.json())
    .then((body) =>
      body.results.map((user) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }))
    );
}

const Text = (data) => {
  const [value, setValue] = React.useState([]);
  return (
    <Form.Item name={data.name} label={data.label}>
      <DebounceSelect
        mode="multiple"
        value={value}
        placeholder="Select users"
        fetchOptions={fetchUserList}
        onChange={(newValue) => {
          setValue(newValue);
        }}
      />
    </Form.Item>
  );
};

export default Text;
