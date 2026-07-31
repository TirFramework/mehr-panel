import React from "react";
import { DatePicker } from "antd";
import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import JalaliDatePicker from "./JalaliDatePicker";
import {
  formatJalali,
  toJalaliDayjs,
  resolveUseJalali,
} from "../lib/jalaliGenerateConfig";
import { useLanguage } from "../context/LanguageContext";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
const parseDayjsValue = (raw, { enableTimezone, showTime, jalali }) => {
  if (!raw) return null;
  const withTime =
    enableTimezone ||
    (showTime && typeof showTime === "object" && Object.keys(showTime).length > 0);

  let parsed;
  if (withTime) {
    parsed = dayjs(raw);
  } else {
    parsed = dayjs(raw, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
    if (!parsed.isValid()) {
      parsed = dayjs(raw);
    }
  }

  if (!parsed.isValid()) return null;
  return jalali ? toJalaliDayjs(parsed) : parsed;
};

const CustomDatePicker = ({
  format,
  onChange,
  value,
  defaultValue,
  jalali,
  PickerComponent = DatePicker,
  ...props
}) => {
  const showTimeObj =
    props.showTime && typeof props.showTime === "object" ? props.showTime : null;
  const IsShowTime = !!(showTimeObj && Object.keys(showTimeObj).length > 0);

  let formattedValue = null;
  if (value) {
    formattedValue = parseDayjsValue(value, {
      enableTimezone: props.enableTimezone,
      showTime: showTimeObj,
      jalali,
    });
  } else if (defaultValue) {
    if (props.enableTimezone || IsShowTime) {
      formattedValue = jalali
        ? toJalaliDayjs(dayjs(defaultValue).utc())
        : dayjs(defaultValue).utc();
    } else {
      formattedValue = parseDayjsValue(defaultValue, {
        enableTimezone: false,
        showTime: false,
        jalali,
      });
    }
  }

  return (
    <PickerComponent
      {...props}
      format={format}
      onChange={(data) => {
        if (!data) {
          onChange(null);
          return;
        }
        // Jalali dayjs formats YYYY as 14xx — switch to Gregorian before API serialize
        const gregorian = dayjs.isDayjs(data)
          ? data.calendar?.("gregory") || dayjs(data)
          : dayjs(data);

        if (props.enableTimezone || IsShowTime) {
          onChange(gregorian.utc().format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ"));
        } else {
          onChange(
            gregorian.startOf("day").format("YYYY-MM-DD") + "T00:00:00.000000Z"
          );
        }
      }}
      value={formattedValue}
      data-cy={props.testId}
    />
  );
};

const DatePickerComponent = (props) => {
  const { lang } = useLanguage();
  const jalali = resolveUseJalali(props.options, lang);
  const dateFormat = props.options.dateFormat
    ? props.options.dateFormat
    : jalali
      ? "YYYY/MM/DD"
      : "YYYY-MM-DD";

  const picker = props.options.picker ? props.options.picker : "date";

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const disablePastDates = (current) => {
    return current && current <= dayjs().startOf("day");
  };

  const formatReadonly = (value) => {
    if (!value) return null;
    const datePart = jalali
      ? formatJalali(value, props?.options?.dateFormat || dateFormat)
      : dayjs(value).format(props?.options?.dateFormat || dateFormat);

    const timePart =
      props.options.showTime &&
      " " +
        (jalali
          ? formatJalali(value, props?.options?.showTime || "HH:mm:ss")
          : dayjs(value).format(props?.options?.showTime || "HH:mm:ss"));

    return (
      <>
        {datePart}
        {timePart}
      </>
    );
  };

  if (props.readonly) {
    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    return (
      <Readonly
        data-cy={props.testId}
        label={label}
        inline={inline}
        options={props.options}
        comment={props.comment}
      >
        {props.value ? (
          formatReadonly(props.value)
        ) : (
          <span style={{ color: "#d9d9d9" }}>-</span>
        )}
      </Readonly>
    );
  }

  const initialRaw = props.value || props.defaultValue;
  const initialValue = initialRaw
    ? jalali
      ? toJalaliDayjs(initialRaw)
      : dayjs(initialRaw)
    : undefined;

  return (
    <>
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        name={props.name}
        initialValue={initialValue}
        rules={rules}
      >
        <CustomDatePicker
          PickerComponent={jalali ? JalaliDatePicker : DatePicker}
          jalali={jalali}
          format={
            !props.options?.showTime?.length
              ? dateFormat
              : dateFormat + " " + props.options.showTime
          }
          showTime={
            props.options?.showTime?.length
              ? { format: props.options.showTime }
              : false
          }
          placeholder={props.options.placeholder}
          disabled={props.readonly}
          picker={picker}
          className={`${props.readonly && "readOnly"} w-full`}
          style={{ width: "100%" }}
          enableTimezone={props.timezone?.[0]}
          timezone={props.timezone?.[1]}
          disabledDate={
            props.options?.disabledPast ? disablePastDates : undefined
          }
          testId={props.testId}
        />
      </LabeledFormItem>
    </>
  );
};

export default DatePickerComponent;
