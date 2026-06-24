import React, { useState } from "react";
import { Button, Card, Row } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import FormGroup from "./FormGroup";

const Group = ({ showCard = true, ...props }) => {
  if (!showCard) {
    return (
      <Row gutter={[16, 16]} data-cy={props.testId}>
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
    );
  }
  const hasCollapseOption = props.options?.collapsed !== undefined;
  // console.log("🚀 ~ Group ~ props:", props)
  const [isCollapsed, setIsCollapsed] = useState(
    props.options?.collapsed === true
  );

  const cardContent = (
    <Row gutter={[16, 16]} style={hasCollapseOption && isCollapsed ? { display: "none" } : undefined}>
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
  );

  return (
    <Card
      title={props.display}
      className={`group ${props.class}`}
      data-cy={props.testId}
      extra={
        hasCollapseOption ? (
          <Button
            // type="text"
            // size="small"
            type="primary"
            icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
            onClick={() => setIsCollapsed((prev) => !prev)}
          />
        ) : null
      }
    >
      {cardContent}
    </Card>
  );
};

export default Group;
