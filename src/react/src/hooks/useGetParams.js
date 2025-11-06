import React, { useEffect, useState } from "react";
import {
  extractQueryParams,
  hasQueryParams,
  isCustomView,
  objectToQueryString,
} from "../lib/utils";
import { useSearchParams } from "react-router-dom";

function useGetParams(key, defaultFilter) {
  const [storedValue, setStoredValue] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // فرض بر این است که searchParams در این scope وجود دارد
    const newQueryParams = extractQueryParams();

    // به‌روزرسانی state با آبجکت ساخته شده
    if (hasQueryParams(newQueryParams)) {
      setStoredValue({ ...newQueryParams, key: key, total: 0, search: null });
    } else {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : { ...defaultFilter });
    }
  }, [key]);

  const setValue = (value) => {
    // console.log("🚀 ~ setValue ~ value:", value);
    let columns = searchParams.get("columns");
    if (columns) {
      columns = columns.split(",");
      columns = columns.map((column) => ({ fieldName: column }));
    }
    try {
      if (isCustomView()) {
        setSearchParams(objectToQueryString(value, columns));
        setStoredValue({ ...value });
      } else {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue({ ...valueToStore });

        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {}
  };

  return [storedValue, setValue];
}

export default useGetParams;
