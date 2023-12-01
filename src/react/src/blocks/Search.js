import { Input } from "antd";
import { useEffect, useState } from "react";

function Search({ value, onSearch, loading }) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <Input.Search
      placeholder="Search"
      onSearch={onSearch}
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
      }}
      loading={loading}
      allowClear
      enterButton
      size="large"
      style={{ width: "80vw", maxWidth: "700px" }}
    />
  );
}

export default Search;
