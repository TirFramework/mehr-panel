import { useEffect, useState } from "react";
import { defaultFIlter } from "../constants/config";

function useLocalStorage(key) {
  const [storedValue, setStoredValue] = useState({
    ...defaultFIlter,
    key: key,
  });

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(item ? JSON.parse(item) : { ...defaultFIlter, key: key });
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue({ ...valueToStore, key: key });

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {}
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
