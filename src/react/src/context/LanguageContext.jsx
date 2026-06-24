// src/LanguageContext.js
import React, { createContext, useState, useContext } from "react";
import Config from "../constants/config";

/**
 * Auto-load all translation files from each language subfolder at build time.
 * import.meta.glob with { eager: true } is resolved by Vite statically —
 * zero runtime cost, no dynamic imports. To add translations for a new
 * component just drop a file in locales/en/, locales/de/, or locales/fa/.
 */
const mergeModules = (modules) =>
  Object.values(modules).reduce(
    (acc, mod) => ({ ...acc, ...(mod.default ?? mod) }),
    {}
  );

const en = mergeModules(import.meta.glob("../locales/en/*.js", { eager: true }));
const de = mergeModules(import.meta.glob("../locales/de/*.js", { eager: true }));
const fa = mergeModules(import.meta.glob("../locales/fa/*.js", { eager: true }));

// Object holding all translations (defaults)
const allTranslations = { en, de, fa };
const defaultLang = Config.defaultLang; // Application default language

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(defaultLang);
  // Initialize t with the default translations for the initial language
  const [t, setT] = useState(allTranslations[defaultLang]);

  // setTranslations updates translations from outside (backend)
  const setTranslations = (newTranslations) => {
    // Copy default translations so we do not mutate them directly
    const updatedAllTranslations = { ...allTranslations };

    // Place new translations in the object for the current language
    // Assumes the backend sends translations for the active language only
    const updatedLangTranslations = {
      ...updatedAllTranslations[lang],
      ...newTranslations,
    };
    updatedAllTranslations[lang] = updatedLangTranslations;

    // Update t with the new object
    setT(updatedLangTranslations);
  };

  const changeLanguage = (newLang) => {
    if (allTranslations[newLang]) {
      setLang(newLang);
      // On language change, update t from the shared translations object
      setT(allTranslations[newLang]);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ lang, t, changeLanguage, setTranslations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
