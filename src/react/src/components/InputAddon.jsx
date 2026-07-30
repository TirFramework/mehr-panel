import React, { forwardRef } from "react";
import { Button, Space } from "antd";

export function renderAddonContent(addon) {
  if (!addon) {
    return null;
  }

  if (typeof addon === "string") {
    if (addon.trim().startsWith("<svg")) {
      return <span dangerouslySetInnerHTML={{ __html: addon }} />;
    }

    return addon;
  }

  return addon;
}

export function extractAddonOptions(options = {}) {
  let opts = options;
  if (typeof opts === "string") {
    try {
      opts = JSON.parse(opts);
    } catch {
      opts = {};
    }
  }

  const {
    addonBefore,
    addonAfter,
    labelType,
    label_type,
    hideLabel,
    hideLable,
    inlineLabel,
    inline_label,
    className,
    class: classAlias,
    from,
    ...inputOptions
  } = typeof opts === "object" && opts && !Array.isArray(opts) ? opts : {};

  return { addonBefore, addonAfter, inputOptions };
}

function CompactAddon({ children }) {
  return (
    <Button disabled tabIndex={-1} style={{ cursor: "default", pointerEvents: "none" }}>
      {children}
    </Button>
  );
}

const InputAddonWrapper = forwardRef(function InputAddonWrapper(
  { addonBefore, addonAfter, children, style, ...fieldProps },
  ref
) {
  const before = renderAddonContent(addonBefore);
  const after = renderAddonContent(addonAfter);

  const inputElement = React.isValidElement(children)
    ? React.cloneElement(children, {
        ...fieldProps,
        ref,
        style: {
          width: "100%",
          ...(children.props?.style || {}),
          ...(fieldProps.style || {}),
        },
      })
    : children;

  if (!before && !after) {
    return inputElement;
  }

  return (
    <Space.Compact block style={{ width: "100%", ...style }}>
      {before ? <CompactAddon>{before}</CompactAddon> : null}
      {inputElement}
      {after ? <CompactAddon>{after}</CompactAddon> : null}
    </Space.Compact>
  );
});

export default InputAddonWrapper;
