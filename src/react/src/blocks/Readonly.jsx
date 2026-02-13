import React from "react";
const Readonly = ({ children, ...props }) => {
  // console.log("🚀 ~ Readonly ~ props:", props);
  return (
    <div className="read-only" {...props}>
      {props.options?.prefix && <label>{props.options.prefix}</label>}
      <div className="read-only__value">{children}</div>
      {props.options?.suffix && <label>{props.options.suffix}</label>}
    </div>
  );
};

export default Readonly;
