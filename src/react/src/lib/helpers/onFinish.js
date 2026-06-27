import { replaceLastNumberFromString } from ".";
import * as api from "../../api";
import { ifExistNumberFromString } from "./duplicate";
import responseErrorHandler from "./responseErrorHandler";
import { getNotificationApi } from "../notificationService";

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
  notification,
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

      const payload = res && typeof res === "object" ? res : {};
      const savedId = payload.id ?? pageId;

      try {
        if (!pageId && savedId != null && setUrlParams) {
          setUrlParams({ id: String(savedId) });
        }

        types.forEach((type) => {
          const queryKeyToGet = `${pageModule}-${savedId}-${type}`;
          queryClient.setQueryData([queryKeyToGet], () => payload.scaffolder);
        });

        if (queryClientKey) {
          queryClient.setQueryData(queryClientKey, (oldData) => {
            if (!Array.isArray(oldData?.data)) {
              return oldData;
            }

            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item.id == pageId ? { ...item, ...values } : item
              ),
            };
          });
        }

        if (payload.message) {
          message?.success(payload.message);
        }

        afterSubmit();
      } catch (postSuccessError) {
        console.error("Post-save handling failed:", postSuccessError);
        if (payload.message) {
          message?.success(payload.message);
        }
      }
    })
    .catch((err) => {
      const error = responseErrorHandler(err);
      const notify = notification ?? getNotificationApi();
      notify?.error({
        message: error.message,
        duration: error.duration,
        description: error.description,
      });
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
