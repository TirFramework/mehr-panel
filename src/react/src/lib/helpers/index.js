const separationRules = ({ pageType, rules, creationRules, updateRules }) => {
  let newRules = [];

  // console.log("🚀 ~ file: index.js ~ line 7 ~ rules", rules)

  if (pageType === "create" && creationRules.length > 0) {
    rules = [...rules, ...creationRules];
  }
  if (pageType === "update" && updateRules.length > 0) {
    rules = [...rules, ...updateRules];
  }

  // console.log("🚀 ~ file: index.js ~ line 7 ~ updateRules", updateRules)
  // console.log("🚀 ~ file: index.js ~ line 7 ~ creationRules", creationRules)
  // console.log("🚀 ~ file: index.js ~ line 7 ~ pageType", pageType)

  // console.log("🚀 ~ file: index.js ~ line 25 ~ rules", rules)
  if (rules.length === 0) {
    // console.log("🚀 ~ file: index.js ~ line 25 ~ rules", rules)
    return false;
  }

  // console.log("🚀 ~ file: not empty", rules)

  // const defaultRules = ['required', '']

  // var search = new RegExp('min' , 'i'); // prepare a regex object
  // let b = rules.filter(item => search.test(item));

  // // console.log(b); // ["foo","fool","cool"]

  // // console.log("🚀 ~ file: index.js ~ line 10 ~ ", rules.indexOf("min") > -1 )

  // newRules['required'] = rules.indexOf("required") > -1;

  // // console.log("🚀 ~ file: index.js ~ line 15 ~ separationRoles ~ newRules", newRules)

  const defaultRules = ["min", "required", "max"];

  for (let i = 0; i < defaultRules.length; i++) {
    let thisRules = {};

    let term = defaultRules[i];

    var search = new RegExp(term, "i"); // prepare a regex object
    let b = rules.filter((item) => search.test(item));

    if (b.length > 0) {
      b = findValue(b[0]);
      thisRules[term] = Number(b);
      // console.log("🚀 ~ file: index.js ~ line 42 ~ separationRoles ~ b", b)
      newRules.push(thisRules);
    }
  }

  return newRules;
};

const findValue = (string) => {
  const regex = /(?<=:)[\w+.-]+/g;
  let arr = string.match(regex);
  if (arr) {
    // console.log("🚀 ~ file: index.js ~ line 60 ~ findValue ~ arr", arr)
    return string.match(regex)[0];
  }
  return true;
};

const diagnosisUseRules = () => {
  return false;
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

export { separationRules, capitalize, mapErrors };
