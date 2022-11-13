import { memo, lazy, Suspense } from "react";
import { Card, Col, Row, Skeleton } from "antd";

import FormGroup from "./FormGroup";

const Group = (props) => {
  return (
    <Card title={props.display}>
      <Row gutter={[16, 16]}>
        {props.children.map((field, index) => (
          <FormGroup key={index} {...field} />
        ))}
      </Row>
    </Card>
  );
};

export default Group;
