import { useEffect, useState } from "react";
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
      // console.log("🚀 ~ useGetParams ~ defaultFilter:", defaultFilter);
      // console.log("🚀 ~ useGetParams ~ newQueryParams:", {
      //   ...newQueryParams,
      //   key: key,
      //   total: 0,
      // });
      setStoredValue({ ...newQueryParams, key: key, total: 0, search: null });
    } else {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : { ...defaultFilter });
    }
  }, [key]);

  const setValue = (value) => {
    // console.log("🚀 ~ setValue ~ value:", value);
    try {
      if (isCustomView()) {
        setSearchParams(objectToQueryString(value));
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
