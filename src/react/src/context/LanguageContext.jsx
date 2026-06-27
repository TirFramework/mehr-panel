import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import dayjs from "dayjs";
import "dayjs/locale/fa";
import "dayjs/locale/de";
import Config from "../constants/config";
import { getLocaleMeta } from "../constants/locales";
import { allTranslations } from "./translations";

const defaultLang = Config.defaultLang;
const defaultLocaleMeta = getLocaleMeta(defaultLang);

document.documentElement.dir = defaultLocaleMeta.dir;
document.documentElement.lang = defaultLang;
dayjs.locale(defaultLocaleMeta.dayjsLocale || "en");

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(defaultLang);
  const [t, setT] = useState(allTranslations[defaultLang]);

  const setTranslations = (newTranslations) => {
    const updatedLangTranslations = {
      ...allTranslations[lang],
      ...newTranslations,
    };
    setT(updatedLangTranslations);
  };

  const changeLanguage = useCallback((newLang) => {
    if (!allTranslations[newLang]) {
      return;
    }

    setLang(newLang);
    setT(allTranslations[newLang]);
  }, []);

  const localeMeta = useMemo(() => getLocaleMeta(lang), [lang]);

  useEffect(() => {
    document.documentElement.dir = localeMeta.dir;
    document.documentElement.lang = lang;
    dayjs.locale(localeMeta.dayjsLocale || "en");
  }, [lang, localeMeta.dir, localeMeta.dayjsLocale]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir: localeMeta.dir,
        antdLocale: localeMeta.antdLocale,
        t,
        changeLanguage,
        setTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
