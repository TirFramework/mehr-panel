import React from "react";
import { useNavigate } from "react-router-dom";

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

export { stringify };
