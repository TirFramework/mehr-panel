import { Button, notification } from "antd";
import { replaceLastNumberFromString, stringToObject } from ".";
import { CloseCircleOutlined } from "@ant-design/icons";

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
        setUrlParams({ id: res.id });
      }
      notification["success"]({
        message: res.message,
      });
    })
    .catch((err) => {
      console.log("🚀 ~ file: onFinish.js:62 ~ err:", err);
      setSubmitLoad(false);

      let mes = [];

      if (err.response.data === undefined) {
        mes.push(
          "Failed to load response data: No data found for resource with given identifier."
        );
      } else {
        if (typeof err.response.data.message === "string") {
          mes.push(err.response.data.message);
        } else {
          for (const [key, value] of Object.entries(
            err.response.data.message
          )) {
            value.forEach((val) => {
              mes.push(val);
            });
          }
        }
      }

      const key = `open${Date.now()}`;
      notification["error"]({
        message: "Error !",

        placement: "top",
        duration: 0,
        style: {
          background: "#ffa39e",
        },
        icon: <CloseCircleOutlined />,
        btn: (
          <Button size="small" onClick={() => notification.close(key)}>
            Confirm
          </Button>
        ),
        key: key,

        description: (
          <ul className="pl-2">
            {mes.map((val) => (
              <li>{val}</li>
            ))}
          </ul>
        ),
      });
    });
};
