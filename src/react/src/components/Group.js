import { memo, lazy, Suspense } from "react";
import { Card, Col, Row, Skeleton } from "antd";

import FormGroup from "./FormGroup";

const Group = (props) => {
  return (
    <Card title={props.display} className={`group ${props.class}`}>
      <Row gutter={[16, 16]}>
        {props.children.map((field, index) => (
          <FormGroup
            addrow={props.addrow}
            removeRow={props.removeRow}
            loading={props.loading}
            index={[props.index, index]}
            pageType={props.pageType}
            key={index}
            form={props.form}
            {...field}
          />
        ))}
      </Row>
    </Card>
  );
};

export default Group;
