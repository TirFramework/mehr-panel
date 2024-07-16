import { App } from "antd";
import { replaceLastNumberFromString, stringToObject } from ".";

import * as api from "../../api";
import { ifExistNumberFromString } from "./duplicate";

export const fixNumber = (obj) => {
    //object should sort before this function
  obj =  sortObject(obj);
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


export const sortObject = (unordered) => {
    const parseKey = (key) => {
        // This regex will capture the number part of the key for sorting purposes
        const match = key.match(/\.([0-9]+)\./);
        return match ? parseInt(match[1], 10) : -1;
    };

    return Object.keys(unordered).sort((a, b) => {
        const numA = parseKey(a);
        const numB = parseKey(b);
        if (numA !== numB) {
            return numA - numB;
        }
        // If the numbers are the same, fall back to lexicographical order
        return a.localeCompare(b);
    }).reduce((obj, key) => {
        obj[key] = unordered[key];
        return obj;
    }, {});
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

    values = fixNumber(values);

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
