/**
 * Label options live on field `options` from the API:
 *   options.hideLabel  — hide the label entirely
 *   options.inlineLabel — label + control on one row, colon after label
 *
 * Also accepted: hideLable / hide_label (typos / snake_case).
 * Top-level `hideLable` is only for table cells (forced hide).
 */

function normalizeOptions(options) {
  if (!options) return {};
  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof options === "object") return options;
  return {};
}

function isOptionEnabled(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function resolveHideLabel({ hideLable, options } = {}) {
  const opts = normalizeOptions(options);
  return Boolean(
    hideLable ||
      isOptionEnabled(opts.hideLabel) ||
      isOptionEnabled(opts.hideLable) ||
      isOptionEnabled(opts.hide_label)
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
  hideLable,
  options,
  className,
} = {}) {
  const opts = normalizeOptions(options);
  const hide = resolveHideLabel({ hideLable, options: opts });
  const inline = !hide && resolveInlineLabel(opts);

  if (hide) {
    return {
      label: null,
      colon: false,
      className: className || undefined,
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
export function readonlyFieldLabel({ display, hideLable, options } = {}) {
  const opts = normalizeOptions(options);
  if (resolveHideLabel({ hideLable, options: opts })) {
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
    hide_label,
    inlineLabel,
    inline_label,
    ...rest
  } = opts;
  return rest;
}
