import dayjs from "dayjs";
import jalaliday from "jalaliday";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(jalaliday);

const JALALI_MONTHS =
  "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split(
    "_"
  );

const FA_JALALI = "fa-jalali";

const faJalaliLocale = {
  name: FA_JALALI,
  weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
  weekdaysShort: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
  weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
  weekStart: 6,
  months: JALALI_MONTHS,
  jmonths: JALALI_MONTHS,
  monthsShort: JALALI_MONTHS,
  ordinal: (n) => n,
  formats: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "YYYY/MM/DD",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd، D MMMM YYYY HH:mm",
  },
};

dayjs.locale(faJalaliLocale, null, true);

const parseLocale = () => FA_JALALI;
const toJalali = (value) => {
  if (!value) {
    return dayjs().calendar("jalali");
  }
  if (dayjs.isDayjs(value)) {
    return value.calendar("jalali");
  }
  return dayjs(value).calendar("jalali");
};

const jalaliGenerateConfig = {
  getNow: () => dayjs().calendar("jalali"),
  getFixedDate: (string) =>
    dayjs(string, { jalali: true }).calendar("jalali"),
  getEndDate: (date) => toJalali(date).endOf("month"),
  getWeekDay: (date) => {
    const clone = toJalali(date).locale("en");
    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getYear: (date) => toJalali(date).year(),
  getMonth: (date) => toJalali(date).month(),
  getDate: (date) => toJalali(date).date(),
  getHour: (date) => toJalali(date).hour(),
  getMinute: (date) => toJalali(date).minute(),
  getSecond: (date) => toJalali(date).second(),
  getMillisecond: (date) => toJalali(date).millisecond(),
  addYear: (date, diff) => toJalali(date).add(diff, "year"),
  addMonth: (date, diff) => toJalali(date).add(diff, "month"),
  addDate: (date, diff) => toJalali(date).add(diff, "day"),
  setYear: (date, year) => toJalali(date).year(year),
  setMonth: (date, month) => toJalali(date).month(month),
  setDate: (date, num) => toJalali(date).date(num),
  setHour: (date, hour) => toJalali(date).hour(hour),
  setMinute: (date, minute) => toJalali(date).minute(minute),
  setSecond: (date, second) => toJalali(date).second(second),
  setMillisecond: (date, milliseconds) =>
    toJalali(date).millisecond(milliseconds),
  isAfter: (date1, date2) => toJalali(date1).isAfter(toJalali(date2)),
  isValidate: (date) => toJalali(date).isValid(),
  locale: {
    getWeekFirstDay: (locale) =>
      dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, date) =>
      toJalali(date).locale(parseLocale(locale)).weekday(0),
    getWeek: (locale, date) =>
      toJalali(date).locale(parseLocale(locale)).week(),
    getShortWeekDays: (locale) =>
      dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: () => JALALI_MONTHS,
    format: (locale, date, format) =>
      toJalali(date).locale(parseLocale(locale)).format(format),
    parse: (locale, text, formats) => {
      const localeStr = parseLocale(locale);
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const date = dayjs(text, {
          format,
          jalali: true,
        })
          .calendar("jalali")
          .locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }
      return null;
    },
  },
};

export default jalaliGenerateConfig;

export const toJalaliDayjs = (value) => {
  if (!value) return null;
  return dayjs(value).calendar("jalali");
};

export const formatJalali = (value, format = "YYYY/MM/DD") => {
  if (!value) return "";
  return dayjs(value).calendar("jalali").locale(FA_JALALI).format(format);
};

/** Jalali when explicitly set, or when lang is fa and calendar is not forced gregorian. */
export const resolveUseJalali = (options = {}, lang) => {
  if (
    options.calendar === "gregory" ||
    options.calendar === "gregorian" ||
    options.jalali === false
  ) {
    return false;
  }
  if (
    options.calendar === "jalali" ||
    options.calendar === "shamsi" ||
    options.jalali === true
  ) {
    return true;
  }
  return lang === "fa";
};
