// src/LanguageContext.js
import React, { createContext, useState, useContext } from "react";
import { en } from "../locales/en";
import { fa } from "../locales/fa";
import Config from "../constants/config";

// یک شیء کلی برای نگهداری تمام ترجمه‌ها (پیش‌فرض)
const allTranslations = { en, fa };
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
