import { useEffect, useState } from "react";

function useLocalStorage(key, defaultFilter) {
  const [storedValue, setStoredValue] = useState({});

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(item ? JSON.parse(item) : { ...defaultFilter });
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue({ ...valueToStore });

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {}
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
