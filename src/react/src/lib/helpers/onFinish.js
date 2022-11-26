import { notification } from "antd";
import { fixNumber, stringToObject } from ".";

import * as api from "../../api";

export const onFinish = ({
  values,
  setSubmitLoad,
  pageModule,
  pageId,
  setUrlParams,
}) => {
  console.log("Success:", values);

  values = fixNumber(values);
  console.log("After ronded :", values);

  values = stringToObject(values);

  console.log("After fix :", values);

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
      setSubmitLoad(false);

      let mes = [];
      for (const [key, value] of Object.entries(err.response.data.message)) {
        value.forEach((val) => {
          mes.push(val);
        });
      }

      notification["warning"]({
        message: "Error !",
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
