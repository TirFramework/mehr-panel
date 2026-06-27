export const DEFAULT_NUMBER_SEPARATOR = ",";

export function formatNumberWithSeparator(
  value,
  separator = DEFAULT_NUMBER_SEPARATOR
) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const str = `${value}`;
  const isNegative = str.startsWith("-");
  const unsigned = isNegative ? str.slice(1) : str;
  const parts = unsigned.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (isNegative ? "-" : "") + parts.join(".");
}

export function parseNumberWithSeparator(
  value,
  separator = DEFAULT_NUMBER_SEPARATOR
) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cleaned = `${value}`.replace(new RegExp(escaped, "g"), "");
  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? cleaned : parsed;
}

export function resolveNumberSeparator(separator) {
  if (!separator) {
    return null;
  }

  return separator === true ? DEFAULT_NUMBER_SEPARATOR : separator;
}

export function sanitizeDigitsOnly(value) {
  return `${value ?? ""}`.replace(/\D/g, "");
}

export function resolveStringInitialValue(value, defaultValue) {
  if (value !== undefined && value !== null && value !== "") {
    return String(value);
  }

  if (
    defaultValue !== undefined &&
    defaultValue !== null &&
    defaultValue !== ""
  ) {
    return String(defaultValue);
  }

  return undefined;
}

export function buildLeadingZeroRules(rules) {
  if (!rules) {
    return [{ type: "string", pattern: /^\d+$/ }];
  }

  return rules.map((rule) => {
    if (rule.required) {
      return rule;
    }

    if (rule.min !== undefined || rule.max !== undefined) {
      return {
        validator: (_, value) => {
          if (value === undefined || value === null || value === "") {
            return Promise.resolve();
          }

          if (!/^\d+$/.test(String(value))) {
            return Promise.reject(new Error("Invalid number"));
          }

          const num = Number(value);

          if (rule.min !== undefined && num < rule.min) {
            return Promise.reject(new Error(`Minimum is ${rule.min}`));
          }

          if (rule.max !== undefined && num > rule.max) {
            return Promise.reject(new Error(`Maximum is ${rule.max}`));
          }

          return Promise.resolve();
        },
      };
    }

    if (rule.pattern) {
      return { ...rule, type: "string" };
    }

    return { ...rule, type: "string", pattern: /^\d+$/ };
  });
}
