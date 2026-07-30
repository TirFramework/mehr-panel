import React from "react";

import { appendCommentToReadonlyLabel } from "../lib/fieldLabel";
import InputAddonWrapper, { extractAddonOptions } from "../components/InputAddon";

/**
 * Detail/readonly field shell.
 * Pass `label` as a node (from resolveReadonlyLabel) and value as children
 * so inlineLabel can put them on one row.
 *
 * Shows options.addonBefore / addonAfter and field comment (tooltip icon).
 */
const Readonly = ({
  children,
  label,
  inline = false,
  options,
  comment,
  className,
  ...props
}) => {
  const classes = [
    "read-only",
    inline ? "read-only--inline" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelNode = appendCommentToReadonlyLabel(label, comment);
  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(options);
  const hasAddons = Boolean(addonBefore || addonAfter);
  const prefix = inputOptions?.prefix ?? (typeof options === "object" ? options?.prefix : undefined);
  const suffix = inputOptions?.suffix ?? (typeof options === "object" ? options?.suffix : undefined);

  const valueContent = hasAddons ? (
    <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
      <div className="read-only__value-text">{children}</div>
    </InputAddonWrapper>
  ) : (
    children
  );

  return (
    <div className={classes} {...props}>
      {prefix ? <label>{prefix}</label> : null}
      {labelNode}
      <div className="read-only__value">{valueContent}</div>
      {suffix ? <label>{suffix}</label> : null}
    </div>
  );
};

export default Readonly;
