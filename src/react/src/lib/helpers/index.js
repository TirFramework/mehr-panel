import Config from "../../constants/config";

const separationRules = ({ pageType, rules, creationRules, updateRules }) => {
  let newRules = [];

  // console.log("🚀 ~ file: index.js ~ line 7 ~ rules", rules)

  if (pageType === "create" && creationRules.length > 0) {
    rules = [...rules, ...creationRules];
  }
  if (pageType === "edit" && updateRules.length > 0) {
    rules = [...rules, ...updateRules];
  }

  // console.log("🚀 ~ file: index.js ~ line 7 ~ updateRules", updateRules)
  // console.log("🚀 ~ file: index.js ~ line 7 ~ creationRules", creationRules)
  // console.log("🚀 ~ file: index.js ~ line 7 ~ pageType", pageType)

  // console.log("🚀 ~ file: index.js ~ line 25 ~ rules", rules)

  if (rules === "") {
    return null;
  }
  if (rules?.length === 0) {
    return null;
  }

  // console.log("🚀 ~ file: not empty", rules)

  // const defaultRules = ['required', '']

  // var search = new RegExp('min' , 'i'); // prepare a regex object
  // let b = rules.filter(item => search.test(item));

  // // console.log(b); // ["foo","fool","cool"]

  // // console.log("🚀 ~ file: index.js ~ line 10 ~ ", rules.indexOf("min") > -1 )

  // newRules['required'] = rules.indexOf("required") > -1;

  // // console.log("🚀 ~ file: index.js ~ line 15 ~ separationrules ~ newRules", newRules)

  const defaultRules = ["min", "required", "max"];

  for (let i = 0; i < defaultRules.length; i++) {
    let thisRules = {};

    let term = defaultRules[i];

    var search = new RegExp(term, "i"); // prepare a regex object
    let b = rules.filter((item) => search.test(item));

    if (b.length > 0) {
      b = findValue(b[0]);
      thisRules[term] = Number(b);
      // console.log("🚀 ~ file: index.js ~ line 42 ~ separationrules ~ b", b)
      newRules.push(thisRules);
    }
  }

  return newRules;
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
  console.log(
    "🚀 ~ file: index.js ~ line 99 ~ removeBaseUrl ~ Config.apiBaseUrl",
    Config.apiBaseUrl
  );
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

const re = new RegExp(/\d+(\.\d+)*$/g);

const removeLastNumberFromString = (str) => str.replace(re, "");

const ifExistNumberFromString = (str) => str.match(re);

const getLastNumber = (str) => Number(str.match(re));

const findNextName = (arry, word) => {
  const NameWithOutNumber = removeLastNumberFromString(word);
  const NameOnlyNumber = getLastNumber(word);

  let nextIndex = null;

  arry.forEach((obj) => {
    if (nextIndex === null) {
      if (obj.name.includes(NameWithOutNumber)) {
        const nextNumber = getLastNumber(obj.name);
        if (nextNumber > NameOnlyNumber) {
          nextIndex = (nextNumber - NameOnlyNumber) / 2 + NameOnlyNumber;
        }
      }
    }
  });

  if (nextIndex === null) {
    nextIndex = NameOnlyNumber + 1;
  }

  return nextIndex;
};

const fixNumber = (obj) => {
  const counts = {};
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (ifExistNumberFromString(key)) {
      const keyWithOuthNumber = removeLastNumberFromString(key);
      if (counts[keyWithOuthNumber]) {
        counts[keyWithOuthNumber] += 1;
      } else {
        counts[keyWithOuthNumber] = 1;
      }
      newObj[keyWithOuthNumber + counts[keyWithOuthNumber]] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
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
  removeLastNumberFromString,
  findNextName,
  getLastNumber,
  fixNumber,
};
