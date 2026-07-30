/**
 * Ant Design Col props from field.col.
 * col === 0 → auto width (content-sized)
 * 1–24 → grid span from the given breakpoint up
 * missing / invalid → full row (24) when `defaultFull` is true; otherwise leave large breakpoints unset
 */
export function resolveFieldColProps(raw, options = {}) {
  const { from = "lg", defaultFull = false } = options;
  const span = Number(raw);

  if (raw === 0 || raw === "0") {
    return {
      flex: "none",
      style: { width: "auto", maxWidth: "100%" },
    };
  }

  if (!Number.isFinite(span) || span <= 0) {
    if (defaultFull) {
      return { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 };
    }
    return { xs: 24, sm: 24, md: 24 };
  }

  const clamped = Math.min(24, Math.max(1, span));
  const base = { xs: 24, sm: 24, md: 24 };

  if (from === "md") {
    return {
      ...base,
      md: clamped,
      lg: clamped,
      xl: clamped,
      xxl: clamped,
    };
  }

  return {
    ...base,
    lg: clamped,
    xl: clamped,
    xxl: clamped,
  };
}
