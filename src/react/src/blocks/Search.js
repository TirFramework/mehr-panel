import { Input } from "antd";
import { useEffect, useState } from "react";

function Search({ value, onSearch, loading, placeholder }) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <Input.Search
      placeholder={placeholder}
      onSearch={onSearch}
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
      }}
      loading={loading}
      allowClear
      enterButton
      size="large"
      className="search-input"
    />
  );
}

export default Search;
