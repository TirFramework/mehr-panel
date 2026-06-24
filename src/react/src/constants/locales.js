import enUS from "antd/locale/en_US";
import deDE from "antd/locale/de_DE";
import faIR from "antd/locale/fa_IR";

export const LOCALE_META = {
  en: { dir: "ltr", antdLocale: enUS, dayjsLocale: "en" },
  de: { dir: "ltr", antdLocale: deDE, dayjsLocale: "de" },
  fa: { dir: "rtl", antdLocale: faIR, dayjsLocale: "fa" },
};

export const getLocaleMeta = (lang) => LOCALE_META[lang] ?? LOCALE_META.en;
