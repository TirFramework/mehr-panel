import React from "react";
import { Card, Row } from "antd";

import FormGroup from "./FormGroup";

const Group = ({ showCard = true, ...props }) => {
  if (!showCard) {
    return (
      <div data-cy={props.testId}>
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
      </div>
    );
  }
  return (
    <Card
      title={props.display}
      className={`group ${props.class}`}
      data-cy={props.testId}
    >
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
