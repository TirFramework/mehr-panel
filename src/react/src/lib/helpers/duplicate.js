const re = new RegExp(/(\d(\.\d+)?)(?!.*\d)/g);
const ifExistNumberFromString = (str) => str.match(re);

export const getLastNumber = (str) => Number(str.match(re));

export const replaceLastNumberFromString = (str, newCaracter = "") =>
  str.replace(re, newCaracter);

export const fixNumber = (obj) => {
  const counts = {};
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (ifExistNumberFromString(key)) {
      const keyWithOuthNumber = replaceLastNumberFromString(key);
      if (counts[keyWithOuthNumber]) {
        counts[keyWithOuthNumber] += 1;
      } else {
        counts[keyWithOuthNumber] = 1;
      }

      newObj[replaceLastNumberFromString(key, counts[keyWithOuthNumber])] =
        obj[key];
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

export const findNextName = (arry, word) => {
  const NameWithOutNumber = replaceLastNumberFromString(word);
  const NameOnlyNumber = getLastNumber(word);

  let nextIndex = null;

  arry.forEach((obj) => {
    if (nextIndex === null) {
      if (obj.name.includes(NameWithOutNumber)) {
        const nextNumber = getLastNumber(obj.name);
        console.log(
          "🚀 ~ file: index.js ~ line 168 ~ arry.forEach ~ nextNumber",
          nextNumber
        );
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
