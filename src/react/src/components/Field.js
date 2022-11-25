import { memo, lazy, Suspense } from "react";
import { Card, Form, Input, Skeleton } from "antd";
import Group from "./Group";
import Text from "./Text";
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
            <Form.Item label={props.display}>
              <input placeholder="loading..." className="ant-input" />
            </Form.Item>
          )}
        </div>
      }
    >
      {props.type === "Group" ? (
        <Group {...props} />
      ) : props.type === "text" ? (
        <Text {...props} />
      ) : (
        <DynamicField type={props.type} {...props} />
      )}
    </Suspense>
  );
};

export default memo(Field);
