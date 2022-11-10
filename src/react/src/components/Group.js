import { memo, lazy, Suspense } from "react";
import { Card, Col, Skeleton } from "antd";

import FormGroup from "./FormGroup";

const Group = (props) => {
  return (
    <Col span={props.col} className={`${props.className}`}>
      <Card title={props.display}>
        {props.children.map((field, index) => (
          <FormGroup key={index} {...field} />
        ))}
      </Card>
    </Col>
  );
};

export default Group;
