const useLocalStorage = (key) => {
  const getValue = () => {
    return JSON.parse(localStorage.getItem(key));
  };
  const setValue = (value) => {
    return localStorage.setItem(key, JSON.stringify(value));
  };

  const value = getValue();

  return [value, setValue];
};

export default useLocalStorage;
