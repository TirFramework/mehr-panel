import React, { memo } from "react";
import TopHeaderComponent from "virtual:top-header";

const TopHeader = (props) => {
  return <TopHeaderComponent {...props} />;
};

export default memo(TopHeader);
