import { App } from "antd";
import { replaceLastNumberFromString, stringToObject } from ".";

import * as api from "../../api";
import { ifExistNumberFromString } from "./duplicate";

export const fixNumber = (obj) => {
  //object should sort before this function
  obj = sortObject(obj);
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

  return Object.keys(unordered)
    .sort((a, b) => {
      const numA = parseKey(a);
      const numB = parseKey(b);
      if (numA !== numB) {
        return numA - numB;
      }
      // If the numbers are the same, fall back to lexicographical order
      return a.localeCompare(b);
    })
    .reduce((obj, key) => {
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
  queryClient,
  queryClientKey = null,
  requestBy,
}) => {
  values = fixNumber(values);

  setSubmitLoad({ isLoading: true, isSuccess: false });

  const types = ["detail", "create-edit"];

  api
    .postEditOrCreate(pageModule, pageId, values, requestBy)
    .then((res) => {
      setSubmitLoad({ isLoading: false, isSuccess: true });

      if (!pageId) {
        setUrlParams({ id: res.id });
      }
      types.forEach((type) => {
        const queryKeyToGet = `${pageModule}-${pageId}-${type}`;

        queryClient.setQueryData([queryKeyToGet], (oldData) => {
          return res.scaffolder;
        });
      });

      if (queryClientKey) {
        queryClient.setQueryData(queryClientKey, (oldData) => {
          const newData = { ...oldData };

          newData?.data.forEach((item) => {
            if (item.id == pageId) {
              for (const [key, value] of Object.entries(values)) {
                item[key] = value;
              }
            }
          });
          return newData;
        });
      }

      afterSubmit();

      message.success(res.message);
    })
    .catch((err) => {
      setSubmitLoad({ isLoading: false, isSuccess: false });
    });
};

// function updateFieldsWithChanges(fields, changes) {
//   if (Array.isArray(fields)) {
//     return fields.map((item) => updateFieldsWithChanges(item, changes));
//   } else if (typeof fields === "object" && fields !== null) {
//     const updatedObject = { ...fields };
//     if (updatedObject.name && changes[updatedObject.name] !== undefined) {
//       updatedObject.value = changes[updatedObject.name];
//     }
//     for (const key in updatedObject) {
//       if (Object.prototype.hasOwnProperty.call(updatedObject, key)) {
//         updatedObject[key] = updateFieldsWithChanges(
//           updatedObject[key],
//           changes
//         );
//       }
//     }
//     return updatedObject;
//   }
//   return fields;
// }
