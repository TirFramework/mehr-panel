import React from "react";

import {
  FieldCommentIcon,
  appendCommentToReadonlyLabel,
} from "../lib/fieldLabel";
import { extractAddonOptions, renderAddonContent } from "../components/InputAddon";

function ReadonlyAddons({ addonBefore, addonAfter, children, endComment }) {
  const before = renderAddonContent(addonBefore);
  const after = renderAddonContent(addonAfter);
  const hasAddons = Boolean(before || after);

  if (!hasAddons && !endComment) {
    return children;
  }

  return (
    <span className="read-only__value-row">
      {before ? <span className="read-only__addon">{before}</span> : null}
      <span className="read-only__value-text">{children}</span>
      {after ? <span className="read-only__addon">{after}</span> : null}
      {endComment}
    </span>
  );
}

/**
 * Detail/readonly field shell.
 * Pass `label` as a node (from resolveReadonlyLabel) and value as children
 * so inlineLabel can put them on one row.
 *
 * Shows options.addonBefore / addonAfter as plain text/icon (not buttons)
 * and field comment (tooltip icon).
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
  const labelHidden = !label;
  const classes = [
    "read-only",
    inline ? "read-only--inline" : null,
    labelHidden && comment?.content !== undefined
      ? "read-only--comment-end"
      : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // When label is hidden, comment goes at the end of the value row (same line).
  const labelNode = labelHidden
    ? null
    : appendCommentToReadonlyLabel(label, comment);
  const endComment = labelHidden ? (
    <FieldCommentIcon comment={comment} />
  ) : null;

  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(options);
  const prefix =
    inputOptions?.prefix ??
    (typeof options === "object" ? options?.prefix : undefined);
  const suffix =
    inputOptions?.suffix ??
    (typeof options === "object" ? options?.suffix : undefined);

  return (
    <div className={classes} {...props}>
      {prefix ? <label>{prefix}</label> : null}
      {labelNode}
      <div className="read-only__value">
        <ReadonlyAddons
          addonBefore={addonBefore}
          addonAfter={addonAfter}
          endComment={endComment}
        >
          {children}
        </ReadonlyAddons>
      </div>
      {suffix ? <label>{suffix}</label> : null}
    </div>
  );
};

export default Readonly;
