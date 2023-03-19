export const re = new RegExp(/(\d+(\.\d+)?)(?!.*\d)/g);

export const getLastNumber = (str) => Number(str.match(re));
export const ifExistNumberFromString = (str) => str.match(re);

export const replaceLastNumberFromString = (str, newCaracter = "") =>
  str.replace(re, newCaracter);

export const findNextName = (arry, word) => {
  const NameWithOutNumber = replaceLastNumberFromString(word);
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
