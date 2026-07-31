import React from "react";
import { Card, Tag } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Field from "../components/Field";
import { useLanguage } from "../context/LanguageContext";
import { formatJalali, resolveUseJalali } from "../lib/jalaliGenerateConfig";
import Config from "../constants/config";

const Render = (props) => {
  const { t, lang } = useLanguage();
  if (props.type === "DatePicker") {
    const jalali = resolveUseJalali(props?.options, lang);
    const dateFormat =
      props?.options?.dateFormat || (jalali ? "YYYY/MM/DD" : "YYYY-MM-DD");

    return (
      <>
        <label>{props.display}:</label>
        <div>
          {props.value &&
            (jalali
              ? formatJalali(props.value, dateFormat)
              : dayjs(props.value).format(dateFormat))}
        </div>
      </>
    );
  } else if (props.type === "Editor") {
    return (
      <>
        <label>{props.display}:</label>
        <Card size="small" className="read-only__value--editor">
          <div dangerouslySetInnerHTML={{ __html: props.value }} />
        </Card>
      </>
    );
  } else if (props.type === "Blank") {
    return <div dangerouslySetInnerHTML={{ __html: props.value }} />;
  } else if (props.type === "Text") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">{props.value}</div>
      </>
    );
  } else if (props.type === "Number") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">{props.value}</div>
      </>
    );
  } else if (props.type === "Password") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">{"•".repeat(8)}</div>
      </>
    );
  } else if (props.type === "Radio") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">{props.value}</div>
      </>
    );
  } else if (props.type === "RangePicker") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">{props.value}</div>
      </>
    );
  } else if (props.type === "Select") {
    const findOptionColor = (value) => {
      if (!Array.isArray(props.data)) return undefined;
      return props.data.find((o) => String(o.value) === String(value))?.color;
    };

    const renderTag = (value, key) => {
      const label = props.dataSet?.[value] ?? value;
      const color = findOptionColor(value);
      const linkTemplate = props.options?.linkTemplate;
      const tag = <Tag color={color}>{label}</Tag>;

      if (!linkTemplate || value === undefined || value === null) {
        return <Tag key={key} color={color}>{label}</Tag>;
      }

      return (
        <Link key={key} to={`/${Config.prefix}/${linkTemplate}/detail?id=${value}`}>
          {tag}
        </Link>
      );
    };

    if (typeof props.value === "object" && Array.isArray(props.value)) {
      return (
        <>
          <label>{props.display}:</label>
          <div>{props.value.map((i) => renderTag(i, i))}</div>
        </>
      );
    }

    return (
      <>
        <label>{props.display}:</label>
        <div>{renderTag(props.value, props.value)}</div>
      </>
    );
  } else if (props.type === "FileUploader") {
    if (typeof props.value === "object") {
      return (
        <>
          <label>{props.display}:</label>
          {props.value.map((i, idx) => (
            <div key={idx}>
              <img
                src={i}
                alt={props.display}
                width={"100px"}
                style={{ maxWidth: "100%" }}
              />
            </div>
          ))}
        </>
      );
    } else {
      return (
        <>
          <label>{props.display}:</label>
          <div>
            <img src={props.value} alt={props.display} />
          </div>
        </>
      );
    }
  } else if (props.type === "Slug") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">{props.value}</div>
      </>
    );
  } else if (props.type === "Switch") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">
          <Tag>{props.value ? t.YES : t.NO}</Tag>
        </div>
      </>
    );
  } else if (props.type === "Textarea") {
    return (
      <>
        <label>{props.display}:</label>
        <div className="read-only__value">{props.value}</div>
      </>
    );
  } else {
    // return <>{props.value} </>;
    return <Field {...props} custom={true} />;
  }
};

export default Render;
