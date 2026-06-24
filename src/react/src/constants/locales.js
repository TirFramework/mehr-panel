import enUS from "antd/locale/en_US";
import deDE from "antd/locale/de_DE";
import faIR from "antd/locale/fa_IR";

export const LOCALE_META = {
  en: { dir: "ltr", antdLocale: enUS },
  de: { dir: "ltr", antdLocale: deDE },
  fa: { dir: "rtl", antdLocale: faIR },
};

export const getLocaleMeta = (lang) => LOCALE_META[lang] ?? LOCALE_META.en;
