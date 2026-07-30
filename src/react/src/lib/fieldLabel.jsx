import React, { forwardRef } from "react";
import { Form } from "antd";

/**
 * Label options:
 *   options.hideLabel  — hide the label entirely
 *   options.inlineLabel — label + control on one row, colon after label
 *
 * Top-level `hideLabel` is only for table cells (forced hide).
 * Legacy API typo `hideLable` is still accepted when reading.
 * Top-level `inlineLabel` is also accepted.
 */

function normalizeOptions(options) {
  let opts = options;
  if (!opts) return {};

  // API may send JSON string (sometimes double-encoded)
  for (let i = 0; i < 2 && typeof opts === "string"; i += 1) {
    try {
      opts = JSON.parse(opts);
    } catch {
      return {};
    }
  }

  if (opts && typeof opts === "object" && !Array.isArray(opts)) {
    return opts;
  }
  return {};
}

function isOptionEnabled(value) {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  if (typeof value === "string" && value.toLowerCase() === "true") {
    return true;
  }
  return false;
}

export function resolveHideLabel({ hideLabel, hideLable, options } = {}) {
  const opts = normalizeOptions(options);
  return Boolean(
    hideLabel ||
      hideLable ||
      isOptionEnabled(opts.hideLabel) ||
      isOptionEnabled(opts.hideLable)
  );
}

export function resolveInlineLabel(options = {}) {
  const opts = normalizeOptions(options);
  return (
    isOptionEnabled(opts.inlineLabel) ||
    isOptionEnabled(opts.inline_label)
  );
}

function isInlineLabel({ inlineLabel, options } = {}) {
  return (
    isOptionEnabled(inlineLabel) || resolveInlineLabel(options)
  );
}

/**
 * Forwards Form.Item value/onChange into the real control, with label on the same row.
 */
const InlineLabelShell = forwardRef(function InlineLabelShell(
  { label, children, ...controlProps },
  ref
) {
  const child = React.Children.only(children);

  return (
    <div className="mp-inline-field">
      <span className="mp-inline-field__label">{label}:</span>
      <div className="mp-inline-field__control">
        {React.cloneElement(child, { ...controlProps, ref })}
      </div>
    </div>
  );
});

/**
 * Form.Item with hideLabel / inlineLabel support that does not fight Ant Design layout.
 */
export function LabeledFormItem({
  display,
  hideLabel,
  hideLable,
  inlineLabel,
  options,
  className,
  children,
  ...rest
}) {
  const hide = resolveHideLabel({ hideLabel, hideLable, options });
  const inline = !hide && isInlineLabel({ inlineLabel, options });

  if (hide) {
    return (
      <Form.Item
        {...rest}
        label={null}
        colon={false}
        className={[className, "field-item--hide-label"].filter(Boolean).join(" ")}
      >
        {children}
      </Form.Item>
    );
  }

  if (inline) {
    return (
      <Form.Item
        {...rest}
        label={null}
        colon={false}
        className={[className, "field-item--inline-label"].filter(Boolean).join(" ")}
      >
        <InlineLabelShell label={display}>{children}</InlineLabelShell>
      </Form.Item>
    );
  }

  return (
    <Form.Item
      {...rest}
      label={display}
      className={className || undefined}
    >
      {children}
    </Form.Item>
  );
}

/**
 * Spread onto Ant Design Form.Item (legacy). Prefer LabeledFormItem for inlineLabel.
 */
export function formItemLabelProps({
  display,
  hideLabel,
  hideLable,
  inlineLabel,
  options,
  className,
} = {}) {
  const hide = resolveHideLabel({ hideLabel, hideLable, options });
  const inline = !hide && isInlineLabel({ inlineLabel, options });

  if (hide) {
    return {
      label: null,
      colon: false,
      className: [className, "field-item--hide-label"].filter(Boolean).join(" "),
    };
  }

  if (inline) {
    // Signal only — real inline UI is LabeledFormItem + InlineLabelShell.
    // Kept so callers that still spread props at least get the class.
    return {
      label: null,
      colon: false,
      className: [className, "field-item--inline-label"].filter(Boolean).join(" "),
    };
  }

  return {
    label: display,
    colon: undefined,
    className: className || undefined,
  };
}

/**
 * Label node for readonly / detail rendering.
 * Returns { label, inline, hidden } so Readonly can place label outside the value.
 */
export function resolveReadonlyLabel({
  display,
  hideLabel,
  hideLable,
  inlineLabel,
  options,
} = {}) {
  if (resolveHideLabel({ hideLabel, hideLable, options })) {
    return { label: null, inline: false, hidden: true };
  }

  const inline = isInlineLabel({ inlineLabel, options });

  if (inline) {
    return {
      hidden: false,
      inline: true,
      label: (
        <span className="field-readonly-label field-readonly-label--inline">
          {display}:
        </span>
      ),
    };
  }

  return {
    hidden: false,
    inline: false,
    label: <div className="field-readonly-label">{display}</div>,
  };
}

/**
 * Label node for readonly / detail rendering (legacy helper).
 */
export function readonlyFieldLabel(props = {}) {
  return resolveReadonlyLabel(props).label;
}

/**
 * Drop label options so they are not forwarded to native inputs.
 */
export function stripLabelOptions(options = {}) {
  const opts = normalizeOptions(options);
  const {
    hideLabel,
    hideLable,
    inlineLabel,
    inline_label,
    ...rest
  } = opts;
  return rest;
}
