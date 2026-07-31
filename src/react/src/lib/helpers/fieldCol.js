/**
 * Ant Design Col props from field.col.
 *
 * Contract: docs/FIELD_COL.md
 *
 * Scalar: 0–24 | "auto" | "fill" | "full" | CSS size ("100px", "50%", …)
 * Responsive: { xs?, sm?, md?, lg?, xl?, xxl? } with the same scalars
 *
 * Options:
 * - from: "lg" | "md" — where scalar grid spans start (mobile stays full below)
 * - defaultFull: when raw is missing/invalid, set all breakpoints to 24
 */

const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl", "xxl"];

const KEYWORD_AUTO = new Set(["auto", "0"]);
const KEYWORD_FULL = new Set(["full"]);
const KEYWORD_FILL = new Set(["fill"]);

function fullProps() {
  return { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 };
}

function fallbackProps(defaultFull) {
  if (defaultFull) return fullProps();
  return { xs: 24, sm: 24, md: 24 };
}

function autoProps() {
  return {
    flex: "none",
    style: { width: "auto", maxWidth: "100%" },
  };
}

function fillProps() {
  return {
    flex: "auto",
    style: { maxWidth: "100%", minWidth: 0 },
  };
}

function sizeProps(size) {
  return {
    flex: `0 0 ${size}`,
    style: { maxWidth: "100%" },
  };
}

function clampSpan(n) {
  return Math.min(24, Math.max(1, Math.round(n)));
}

function spanFrom(from, clamped) {
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

/**
 * @returns {{ type: 'auto'|'fill'|'full'|'span'|'size'|'invalid', value?: number|string }}
 */
function parseScalar(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return { type: "invalid" };
  }

  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return { type: "invalid" };
    if (raw === 0) return { type: "auto" };
    if (raw > 0) return { type: "span", value: clampSpan(raw) };
    return { type: "invalid" };
  }

  if (typeof raw !== "string") {
    return { type: "invalid" };
  }

  const trimmed = raw.trim();
  if (!trimmed) return { type: "invalid" };

  const lower = trimmed.toLowerCase();
  if (KEYWORD_AUTO.has(lower)) return { type: "auto" };
  if (KEYWORD_FULL.has(lower)) return { type: "full" };
  if (KEYWORD_FILL.has(lower)) return { type: "fill" };

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const n = Number(trimmed);
    if (n === 0) return { type: "auto" };
    if (n > 0) return { type: "span", value: clampSpan(n) };
    return { type: "invalid" };
  }

  // Any other non-empty string → CSS size / flex basis
  return { type: "size", value: trimmed };
}

/** Col value for one breakpoint (number | ColSize). */
function toBreakpointValue(parsed) {
  switch (parsed.type) {
    case "auto":
      return { flex: "none" };
    case "fill":
      return { flex: "auto" };
    case "full":
      return 24;
    case "span":
      return parsed.value;
    case "size":
      return { flex: `0 0 ${parsed.value}` };
    default:
      return 24;
  }
}

/** Top-level Col props for a scalar (non-responsive) value. */
function scalarToProps(parsed, from, defaultFull) {
  switch (parsed.type) {
    case "auto":
      return autoProps();
    case "fill":
      return fillProps();
    case "full":
      return fullProps();
    case "span":
      return spanFrom(from, parsed.value);
    case "size":
      return sizeProps(parsed.value);
    default:
      return fallbackProps(defaultFull);
  }
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * Mobile-first cascade over xs…xxl.
 * Below the first defined key → full (24).
 * From each defined key upward → that value until the next definition.
 */
function resolveResponsiveObject(obj, defaultFull) {
  const defined = {};
  for (const bp of BREAKPOINTS) {
    if (obj[bp] === undefined || obj[bp] === null || obj[bp] === "") continue;
    const parsed = parseScalar(obj[bp]);
    if (parsed.type === "invalid") continue;
    defined[bp] = parsed;
  }

  const keys = BREAKPOINTS.filter((bp) => defined[bp]);
  if (keys.length === 0) {
    return fallbackProps(defaultFull);
  }

  const firstIdx = BREAKPOINTS.indexOf(keys[0]);
  const result = {};
  let current = null;

  for (let i = 0; i < BREAKPOINTS.length; i++) {
    const bp = BREAKPOINTS[i];
    if (defined[bp]) {
      current = defined[bp];
    }
    if (i < firstIdx) {
      result[bp] = 24;
    } else if (current) {
      result[bp] = toBreakpointValue(current);
    }
  }

  return result;
}

export function resolveFieldColProps(raw, options = {}) {
  const { from = "lg", defaultFull = false } = options;

  if (raw === null || raw === undefined || raw === "") {
    return fallbackProps(defaultFull);
  }

  if (Array.isArray(raw)) {
    return fallbackProps(defaultFull);
  }

  if (isPlainObject(raw)) {
    return resolveResponsiveObject(raw, defaultFull);
  }

  return scalarToProps(parseScalar(raw), from, defaultFull);
}
