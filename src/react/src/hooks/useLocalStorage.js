import { useEffect, useState } from "react";
import { defaultFIlter } from "../constants/config";

function useLocalStorage(key) {
  console.log("🚀 ~ file: useLocalStorage.js:5 ~ useLocalStorage ~ key:", key);
  const [storedValue, setStoredValue] = useState({});

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(item ? JSON.parse(item) : defaultFIlter);
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {}
  };

  console.log(
    "🚀 ~ file: useLocalStorage.js:15 ~ const[storedValue,setStoredValue]=useState ~ storedValue:",
    storedValue
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
