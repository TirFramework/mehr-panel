/**
 * Label options:
 *   options.hideLabel  — hide the label entirely
 *   options.inlineLabel — label + control on one row, colon after label
 *
 * Top-level `hideLabel` is only for table cells (forced hide).
 * Legacy API typo `hideLable` is still accepted when reading.
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
  return value === true || value === 1 || value === "1" || value === "true";
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

/**
 * Spread onto Ant Design Form.Item.
 * Pass the field's `options` object (where hideLabel / inlineLabel live).
 */
export function formItemLabelProps({
  display,
  hideLabel,
  hideLable,
  options,
  className,
} = {}) {
  const opts = normalizeOptions(options);
  const hide = resolveHideLabel({ hideLabel, hideLable, options: opts });
  const inline = !hide && resolveInlineLabel(opts);

  if (hide) {
    return {
      label: null,
      colon: false,
      className: [className, "field-item--hide-label"].filter(Boolean).join(" "),
    };
  }

  const classes = [className, inline ? "field-item--inline-label" : null]
    .filter(Boolean)
    .join(" ");

  return {
    label: display,
    colon: inline ? true : undefined,
    className: classes || undefined,
  };
}

/**
 * Label node for readonly / detail rendering.
 */
export function readonlyFieldLabel({
  display,
  hideLabel,
  hideLable,
  options,
} = {}) {
  const opts = normalizeOptions(options);
  if (resolveHideLabel({ hideLabel, hideLable, options: opts })) {
    return null;
  }

  if (resolveInlineLabel(opts)) {
    return (
      <span className="field-readonly-label field-readonly-label--inline">
        {display}:
      </span>
    );
  }

  return <div className="field-readonly-label">{display}</div>;
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