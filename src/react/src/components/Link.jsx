import React, { useMemo } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import * as antdIcons from "@ant-design/icons";

const resolveIcon = (icon) => {
  if (!icon) return undefined;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === "string") {
    const IconComponent = antdIcons[icon];
    if (IconComponent) return <IconComponent />;
  }
  return undefined;
};

const Link = (props) => {
  const navigate = useNavigate();
  const { icon, ...buttonOptions } = props.options ?? {};
  const resolvedIcon = useMemo(() => resolveIcon(icon), [icon]);

  return (
    <Button
      {...buttonOptions}
      icon={resolvedIcon}
      data-cy={props.testId}
      onClick={() => navigate(props.path)}
    >
      {props.display}
    </Button>
  );
};

export default Link;
