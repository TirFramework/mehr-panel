import React from "react";
import { useHistory } from "react-router-dom";

function stringify(search, obj) {
  const urlParams = new URLSearchParams(search);

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      urlParams.set(key, String(value));
    } else {
      urlParams.delete(key);
    }
  });

  return urlParams.toString();
}

function useUrlParams() {
  const history = useHistory();

  const [urlParams, setUrlParams] = React.useState(
    new URLSearchParams(history.location.search)
  );

  React.useEffect(() => {
    setUrlParams(new URLSearchParams(history.location.search));
  }, [history.location.search]);

  const paramsObject = {};

  urlParams.forEach((value, key) => {
    if (value === "true") {
      paramsObject[key] = true;
      return;
    }

    if (value === "false") {
      paramsObject[key] = false;
      return;
    }

    paramsObject[key] = value;
  });

  const setNewUrlParams = (newValues) => {
    // Object.entries(newValues).forEach(([key, value]) => {
    //   if (value !== null && value !== undefined) {
    //     urlParams.set(key, String(value));
    //   } else {
    //     urlParams.delete(key);
    //   }
    // });

    const stringifiedParams = stringify(history.location.search, newValues);

    history.push(`${history.location.pathname}?${stringifiedParams}`);
    // history.push(`${history.location.pathname}?${urlParams.toString()}`);
  };

  return [paramsObject, urlParams.toString(), setNewUrlParams];
}

export { useUrlParams, stringify };
