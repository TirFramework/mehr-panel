import Config from "../../constants/config";

export { onFinish } from "./onFinish";
export {
  replaceLastNumberFromString,
  findNextName,
  getLastNumber,
} from "./duplicate";

const separationRules = ({ pageType, rules, creationRules, updateRules }) => {
  let allRules = [];

  // جمع کردن تمام rules
  if (rules && Array.isArray(rules)) {
    allRules = [...allRules, ...rules];
  }
  if (
    pageType === "create" &&
    creationRules &&
    Array.isArray(creationRules) &&
    creationRules.length > 0
  ) {
    allRules = [...allRules, ...creationRules];
  }
  if (
    pageType === "edit" &&
    updateRules &&
    Array.isArray(updateRules) &&
    updateRules.length > 0
  ) {
    allRules = [...allRules, ...updateRules];
  }

  if (!allRules || allRules.length === 0) {
    return null;
  }

  // استفاده از Map برای جلوگیری از تکرار
  const rulesMap = new Map();

  // پردازش هر rule
  allRules.forEach((rule) => {
    if (typeof rule === "string") {
      // اگر rule یک رشته است، آن را پردازش کن
      if (rule.includes("|")) {
        // اگر شامل | است، آن را تقسیم کن
        const parts = rule.split("|").map((part) => part.trim());
        parts.forEach((part) => {
          const ruleObj = parseRuleString(part);
          if (ruleObj) {
            mergeRule(rulesMap, ruleObj);
          }
        });
      } else {
        // اگر شامل | نیست، مستقیماً پردازش کن
        const ruleObj = parseRuleString(rule);
        if (ruleObj) {
          mergeRule(rulesMap, ruleObj);
        }
      }
    } else if (typeof rule === "object") {
      // اگر rule یک آبجکت است، مستقیماً اضافه کن
      mergeRule(rulesMap, rule);
    }
  });

  // تبدیل Map به آرایه
  const newRules = Array.from(rulesMap.values());

  return newRules.length > 0 ? newRules : null;
};

// تابع کمکی برای merge کردن rules و جلوگیری از تکرار
const mergeRule = (rulesMap, ruleObj) => {
  if (!ruleObj || typeof ruleObj !== "object") {
    return;
  }

  const keys = Object.keys(ruleObj);

  keys.forEach((key) => {
    if (key === "required") {
      // برای required، اگر true است، همیشه true نگه دار
      if (ruleObj[key] === true) {
        rulesMap.set(key, { required: true });
      }
    } else if (key === "min") {
      // برای min، مقدار بزرگتر را نگه دار (سخت‌گیرانه‌تر)
      const existing = rulesMap.get(key);
      if (!existing) {
        rulesMap.set(key, { min: ruleObj[key] });
      } else {
        rulesMap.set(key, { min: Math.max(existing.min, ruleObj[key]) });
      }
    } else if (key === "max") {
      // برای max، مقدار کوچکتر را نگه دار (سخت‌گیرانه‌تر)
      const existing = rulesMap.get(key);
      if (!existing) {
        rulesMap.set(key, { max: ruleObj[key] });
      } else {
        rulesMap.set(key, { max: Math.min(existing.max, ruleObj[key]) });
      }
    } else {
      // برای سایر rules، اگر قبلاً وجود نداشته باشد اضافه کن
      // اگر وجود داشته باشد، merge کن (برای patterns و messages)
      if (!rulesMap.has(key)) {
        rulesMap.set(key, ruleObj);
      } else {
        const existing = rulesMap.get(key);
        rulesMap.set(key, { ...existing, ...ruleObj });
      }
    }
  });
};

// تابع کمکی برای پردازش رشته‌های rule Laravel
const parseRuleString = (ruleString) => {
  if (!ruleString || typeof ruleString !== "string") {
    return null;
  }

  const trimmedRule = ruleString.trim();

  // required
  if (trimmedRule === "required") {
    return { required: true };
  }

  // nullable
  if (trimmedRule === "nullable") {
    return null; // nullable یعنی required نیست
  }

  // numeric
  if (trimmedRule === "numeric") {
    return { type: "number" };
  }

  // integer
  if (trimmedRule === "integer") {
    return { type: "number", transform: (value) => Math.floor(value) };
  }

  // min:value
  if (trimmedRule.startsWith("min:")) {
    const value = trimmedRule.split(":")[1];
    return { min: Number(value) };
  }

  // max:value
  if (trimmedRule.startsWith("max:")) {
    const value = trimmedRule.split(":")[1];
    return { max: Number(value) };
  }

  // between:min,max
  if (trimmedRule.startsWith("between:")) {
    const values = trimmedRule.split(":")[1].split(",");
    return {
      min: Number(values[0]),
      max: Number(values[1]),
    };
  }

  // size:value
  if (trimmedRule.startsWith("size:")) {
    const value = trimmedRule.split(":")[1];
    return {
      min: Number(value),
      max: Number(value),
    };
  }

  // email
  if (trimmedRule === "email") {
    return { type: "email" };
  }

  // url
  if (trimmedRule === "url") {
    return { type: "url" };
  }

  // alpha
  if (trimmedRule === "alpha") {
    return {
      pattern: /^[A-Za-z]+$/,
    };
  }

  // alpha_num
  if (trimmedRule === "alpha_num") {
    return {
      pattern: /^[A-Za-z0-9]+$/,
    };
  }

  // digits:value
  if (trimmedRule.startsWith("digits:")) {
    const value = trimmedRule.split(":")[1];
    return {
      pattern: new RegExp(`^\\d{${value}}$`),
    };
  }

  // digits_between:min,max
  if (trimmedRule.startsWith("digits_between:")) {
    const values = trimmedRule.split(":")[1].split(",");
    return {
      pattern: new RegExp(`^\\d{${values[0]},${values[1]}}$`),
    };
  }

  return null;
};

export const getAccept = (rules) => {
  const format = {
    mp4: "video/mp4",
    png: "video/mp4",
  };
  let acceptFormat = [];
  rules.forEach((rule) => {
    if (rule.search(":")) {
      const ruleArr = rule.split(":");
      const ruleKey = ruleArr[0];

      if (ruleKey === "mimes") {
        const rulevalues = ruleArr[1];
        const rulevaluesArr = rulevalues.split(",");
        rulevaluesArr.forEach((item) => {
          acceptFormat.push(`.${item}`);
        });
      }
    }
  });

  return acceptFormat;
};

const findValue = (string) => {
  const regex = /:\w+/g;
  let arr = string.match(regex);
  if (arr) {
    // console.log("🚀 ~ file: index.js ~ line 60 ~ findValue ~ arr", arr)
    let str = string.match(regex)[0];
    return str.replace(":", "");
  }
  return true;
};

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const mapErrors = (errors) => {
  let errs = [];
  for (const [key, value] of Object.entries(errors)) {
    errs.push(`${key}: ${value}`);
  }
  return errs;
};

const removeBaseUrl = (str) => {
  return str.replace(Config.apiBaseUrl, "");
};

const removeNullFromObject = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};

const isRequired = (arr) => {
  if (arr === null) {
    return false;
  }
  for (let i = 0; i < arr.length; i++) {
    if (Object.keys(arr[i]).find((element) => element === "required")) {
      return true;
    }
  }
  return false;
};

const findDuplicateName = (arry, word) => {
  let count = 0;
  arry.forEach((obj) => {
    if (obj.name.includes(word)) {
      count++;
    }
  });

  return count;
};

const increaseNumberInString = (str) => {
  return str.replace(
    new RegExp(/\d+/g),
    Number(str.match(new RegExp(/\d+/g))[0]) + 1
  );
};

const decreaseNumberInString = (str) => {
  return str.replace(
    new RegExp(/\d+/g),
    Number(str.match(new RegExp(/\d+/g))[0]) - 1
  );
};

export const stringToObject = (obj) => {
  let newObj = {};

  Object.keys(obj).forEach((item) => {
    const arr = item.split(".");
    const value = obj[item];

    if (arr.length === 1) {
      newObj = {
        ...newObj,
        [arr[0]]: value,
      };
    }

    if (arr.length === 2) {
      let level2 = {};

      if (newObj[arr[0]]) {
        level2 = newObj[arr[0]];
      }

      newObj = {
        ...newObj,
        [arr[0]]: {
          ...level2,
          [arr[1]]: value,
        },
      };
    }

    if (arr.length === 3) {
      let level2 = {};
      let level3 = {};

      if (newObj[arr[0]]) {
        level2 = newObj[arr[0]];
        if (newObj[arr[0]][arr[1]]) {
          level3 = newObj[arr[0]][arr[1]];
        }
      }

      newObj = {
        ...newObj,
        [arr[0]]: {
          ...level2,
          [arr[1]]: {
            ...level3,
            [arr[2]]: value,
          },
        },
      };
    }

    if (arr.length === 4) {
      let level2 = {};
      let level3 = {};
      let level4 = {};

      if (newObj[arr[0]]) {
        level2 = newObj[arr[0]];
        if (newObj[arr[0]][arr[1]]) {
          level3 = newObj[arr[0]][arr[1]];
          if (newObj[arr[0]][arr[1]][arr[2]]) {
            level4 = newObj[arr[0]][arr[1]][arr[2]];
          }
        }
      }

      newObj = {
        ...newObj,
        [arr[0]]: {
          ...level2,
          [arr[1]]: {
            ...level3,
            [arr[2]]: {
              ...level4,
              [arr[3]]: value,
            },
          },
        },
      };
    }
  });

  return newObj;
};

export const notEmpty = (obj) => {
  if (obj) {
    if (Object.keys(obj).length > 0) {
      return true;
    }
  }
  return false;
};

export {
  separationRules,
  capitalize,
  mapErrors,
  removeBaseUrl,
  removeNullFromObject,
  isRequired,
  findDuplicateName,
  increaseNumberInString,
  decreaseNumberInString,
};
