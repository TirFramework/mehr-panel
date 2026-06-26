const mergeModules = (modules) =>
  Object.values(modules).reduce(
    (acc, mod) => ({ ...acc, ...(mod.default ?? mod) }),
    {}
  );

const en = mergeModules(import.meta.glob("../locales/en/*.js", { eager: true }));
const de = mergeModules(import.meta.glob("../locales/de/*.js", { eager: true }));
const fa = mergeModules(import.meta.glob("../locales/fa/*.js", { eager: true }));

export const allTranslations = { en, de, fa };

export const getT = (lang) => allTranslations[lang] ?? allTranslations.en;
