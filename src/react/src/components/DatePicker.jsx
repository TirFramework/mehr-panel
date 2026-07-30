import React from "react";
import { DatePicker } from "antd";
import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const CustomDatePicker = ({
  format,
  onChange,
  value,
  defaultValue,
  ...props
}) => {
  const IsShowTime = Object.keys(props.showTime).length > 0;
  let formattedValue = null;
  if (value) {
    if (props.enableTimezone || IsShowTime) {
      formattedValue = dayjs(value);
    } else {
      formattedValue = dayjs(value, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
    }
  } else if (defaultValue) {
    if (props.enableTimezone || IsShowTime) {
      formattedValue = dayjs(defaultValue).utc();
    } else {
      formattedValue = dayjs(defaultValue, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
    }
  }

  return (
    <DatePicker
      {...props}
      format={format}
      onChange={(data) => {
        if (props.enableTimezone || IsShowTime) {
          let formattedData = null;
          if (data) {
            formattedData = dayjs(data).utc().format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
          }
          onChange(formattedData);
        } else {
          onChange(
            data
              ? dayjs(data).startOf("day").format("YYYY-MM-DD") +
              "T00:00:00.000000Z"
              : null
          );
        }
      }}
      value={formattedValue}
      data-cy={props.testId}
    />
  );
};

const DatePickerComponent = (props) => {
  const dateFormat = props.options.dateFormat
    ? props.options.dateFormat
    : "YYYY-MM-DD";

  const picker = props.options.picker ? props.options.picker : "date";

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  const disablePastDates = (current) => {
    // Disable dates before or equal to today
    return current && current <= new Date().setHours(0, 0, 0, 0);
  };

  if (props.readonly) {
    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    return (
      <Readonly data-cy={props.testId} label={label} inline={inline} options={props.options}>
        {props.value ? (
          <>
            {dayjs(props.value).format(props?.options?.dateFormat) ||
              "YYYY-MM-DD"}

            {props.options.showTime &&
              " " +
              dayjs(props.value).format(
                props?.options?.showTime || "HH:mm:ss"
              )}
          </>
        ) : (
          <span style={{ color: '#d9d9d9' }}>-</span>
        )}
      </Readonly>
    );
  }

  return (
    <>
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        name={props.name}
        initialValue={
          props.value
            ? dayjs(props.value)
            : props.defaultValue
              ? dayjs(props.defaultValue)
              : undefined
        }
        rules={rules}
      >
        <CustomDatePicker
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
          enableTimezone={props.timezone[0]}
          timezone={props.timezone[1]}
          disabledDate={
            props.options?.disabledPast ? { disablePastDates } : false
          }
          testId={props.testId}
        />
      </LabeledFormItem>
    </>
  );
};

export default DatePickerComponent;
