import React, { useEffect, useState } from "react";
import { Input, Space, Button } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";

function Search({ value, onSearch, loading, placeholder }) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Space className="search-input-container" orientation="vertical" size={0}>
      <Space.Compact size="large" className="search-input">
        <Input
          placeholder={placeholder}
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          allowClear
          size="large"
        />
        <Button
          type="primary"
          icon={loading ? <LoadingOutlined /> : <SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
          size="large"
        />
      </Space.Compact>
    </Space>
  );
}

export default Search;
