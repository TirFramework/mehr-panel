import React from "react";

/**
 * Detail/readonly field shell.
 * Pass `label` as a node (from readonlyFieldLabel) and value as children
 * so inlineLabel can put them on one row.
 */
const Readonly = ({ children, label, inline = false, options, className, ...props }) => {
  const classes = [
    "read-only",
    inline ? "read-only--inline" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {options?.prefix ? <label>{options.prefix}</label> : null}
      {label}
      <div className="read-only__value">{children}</div>
      {options?.suffix ? <label>{options.suffix}</label> : null}
    </div>
  );
};

export default Readonly;
