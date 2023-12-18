import { App } from "antd";
import { replaceLastNumberFromString, stringToObject } from ".";

import * as api from "../../api";
import { ifExistNumberFromString } from "./duplicate";

export const fixNumber = (obj) => {
  const counts = {};
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (ifExistNumberFromString(key)) {
      const keyWithOuthNumber = replaceLastNumberFromString(key);
      if (counts[keyWithOuthNumber] !== undefined) {
        counts[keyWithOuthNumber] += 1;
      } else {
        counts[keyWithOuthNumber] = 0;
      }

      newObj[replaceLastNumberFromString(key, counts[keyWithOuthNumber])] =
        obj[key];
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

export const onFinish = ({
  values,
  setSubmitLoad,
  pageModule,
  pageId,
  setUrlParams,
  message,
  afterSubmit = () => {},
}) => {
  // console.log("Success:", values);

  values = fixNumber(values);
  // console.log("After ronded :", values);

  // values = stringToObject(values);

  // console.log("After fix :", values);

  setSubmitLoad(true);

  api
    .postEditOrCreate(pageModule, pageId, values)
    .then((res) => {
      setSubmitLoad(false);

      if (!pageId) {
        setUrlParams({ newId: res.id });
      }
      afterSubmit();
      message.success(res.message);
    })
    .catch((err) => {
      setSubmitLoad(false);
    });
};
