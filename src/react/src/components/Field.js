import { memo, lazy, Suspense } from "react";
import { Card, Form, Input, Skeleton } from "antd";
import Submit from "./Submit";
import Cancel from "./Cancel";
import Group from "./Group";
import Text from "./Text";
import { useSearchParams } from "react-router-dom";
// import { capitalize } from "../lib/helpers"

// const DynamicField = (props) => {
//   const F = lazy(() => import(`./${props.type}.js`));
//   return <F {...props} />;
// };

const Field = (props) => {
  const DynamicField = lazy(() => import(`./${props.type}`));
  return (
    <Suspense
      fallback={
        <div>
          {props.type == "Group" ? (
            <Card title={props.display}>
              {props.children.map((field, index) => (
                <Form.Item label={field.display} key={index}>
                  <input placeholder="loading..." className="ant-input" />
                </Form.Item>
              ))}
            </Card>
          ) : (
            <></>
          )}
        </div>
      }
    >
      {props.type === "Group" ? (
        <Group {...props} />
      ) : props.type === "Cancel" ? (
        <Cancel {...props} />
      ) : props.type === "Submit" ? (
        <Submit {...props} />
      ) : (
        <DynamicField
          type={props.type}
          {...props}
          // showInIndex={props.id != pageId}
        />
      )}
    </Suspense>
  );
};

export default memo(Field);
