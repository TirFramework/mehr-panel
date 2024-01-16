import { Card, DatePicker, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Field from "../components/Field";

const Render = (props) => {
  if (props.type === "DatePicker") {
    return (
      <>
        <label>{props.display}:</label>
        <div>
          {dayjs(props.value).format(
            props?.options?.dateFormat || "YYYY-MM-DD"
          )}
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
        <div className="read-only__value">{props.value}</div>
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
    if (typeof props.value === "object") {
      return (
        <>
          <label>{props.display}:</label>
          <div>
            {props.value.map((i) => (
              <Tag>{props.dataSet[i]}</Tag>
            ))}
          </div>
        </>
      );
    } else {
      return (
        <>
          <label>{props.display}:</label>
          <div>
            <Tag>{props.dataSet[props.value]}</Tag>
          </div>
        </>
      );
    }
  } else if (props.type === "FileUploader") {
    if (typeof props.value === "object") {
      return (
        <>
          <label>{props.display}:</label>
          {props.value.map((i) => (
            <div>
              <img src={i} width={"100px"} style={{ maxWidth: "100%" }} />
            </div>
          ))}
        </>
      );
    } else {
      return (
        <>
          <label>{props.display}:</label>
          <div>
            <img src={props.value} />
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
          <Tag>{props.value ? "Yes" : "No"}</Tag>
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
