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

// یک شیء کلی برای نگهداری تمام ترجمه‌ها (پیش‌فرض)
const allTranslations = { en, de, fa };
const defaultLang = Config.defaultLang; // زبان پیش‌فرض اپلیکیشن

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(defaultLang);
  // t را با ترجمه‌های پیش‌فرض زبان اولیه پر می‌کنیم
  const [t, setT] = useState(allTranslations[defaultLang]);

  // تابع setTranslations برای به‌روزرسانی ترجمه‌ها از بیرون (بک‌اند)
  const setTranslations = (newTranslations) => {
    // یک کپی از ترجمه‌های پیش‌فرض ایجاد می‌کنیم تا مستقیماً به آن‌ها دست نزنیم
    const updatedAllTranslations = { ...allTranslations };

    // ترجمه‌های جدید را در شیء زبان مربوطه قرار می‌دهیم
    // فرض می‌کنیم بک‌اند فقط ترجمه‌های زبان فعلی را می‌فرستد
    const updatedLangTranslations = {
      ...updatedAllTranslations[lang],
      ...newTranslations,
    };
    updatedAllTranslations[lang] = updatedLangTranslations;

    // t را با آبجکت جدید آپدیت می‌کنیم
    setT(updatedLangTranslations);
  };

  const changeLanguage = (newLang) => {
    if (allTranslations[newLang]) {
      setLang(newLang);
      // با تغییر زبان، t را با ترجمه مربوطه از شیء کلی آپدیت می‌کنیم
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
