import { memo, lazy, Suspense } from "react";
import { Col, Skeleton } from "antd";

import Field from "../components/Field";


const Group = (props) => {
  return (
    <>
      {props.children.map((field, index) => (
        <Col key={index} span={field.col} className={field.className}>
          <Field type={field.type} {...field} /> 
        </Col>
      ))}
    </>
  );
};

export default Group;
