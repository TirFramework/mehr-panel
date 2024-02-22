import { Popover, Tag } from "antd";
import dayjs from "dayjs";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";

import { useSearchParams } from "react-router-dom";
import Config from "../constants/config";
import Field from "../components/Field";
import FilterDate from "../blocks/FilterDate";
export const getColsNormalize = (res) => {
  let cols = res.cols;
  const interactionCharacter =
    res.configs.primary_key || Config.interactionCharacter;
  //   // loop for detect array
  cols.forEach((col) => {
    // ----------------------------------------
    // convert to array
    col.dataIndex = col.dataIndex.split(".");
    // ----------------------------------------
    // -----------------------------------
    // add data for filter
    col.sorter = col.field.sortable;

    // -----------------------------------
    // -----------------------------------
    // add data for filter
    if (col.filters !== undefined) {
      if (["DatePicker", "Slider", "Search"].includes(col.filterType)) {
        col.filterDropdown = (props) => {
          return (
            <FilterDate
              {...props}
              filtersType={col.filterType}
              data={col.filters}
            />
          );
        };
      }

      if (col.filterType === "Search") {
        col.filterIcon = (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        );
      }

      col.filters?.map((item) => (item.text = item.label));
      col.filterSearch = col.filters.length > 10;
    }
    // -----------------------------------
    // -----------------------------------
    // add data for filter
    if (col.filters !== undefined) {
      col.filters?.map((item) => (item.text = item.label));
      col.filterSearch = col.filters.length > 10;
    }
    // -----------------------------------

    col.render = (value, data, rowIndex) => {
      return (
        <Render
          value={value}
          item={col}
          data={data}
          rowIndex={rowIndex}
          id={data[interactionCharacter]}
          minWidth={
            col.field.options?.minWidth ||
            calculatWidth(
              col.field.display,
              value,
              !!col.filters,
              col.field.sortable
            )
          }
        />
      );
    };

    col.title = (
      <div title={col.title}>
        {col.title}
        {col.comment?.content !== undefined && (
          <Popover content={col.comment.content} title={col.comment.title}>
            <QuestionCircleOutlined />
          </Popover>
        )}
      </div>
    );
    // col.sorter = col.field.sortable;
    // if (activeColumn.length > 0) {
    //   if (!activeColumn.includes(col.fieldName)) {
    //     col.className = "hidden";
    //   }
    // }

    // col.width = 800;
    // col.textWrap = "word-break";
  });
  // cols.push(actions(res.configs.actions, pageModule));
  return res;
};

export const indexOfInObject = (arr, obj, val, label) => {
  let result = -1;
  arr.forEach((element, index) => {
    if (element[obj] === val) {
      result = index;
    }
  });

  if (label) {
    if (result !== -1) {
      return arr[result][label];
    } else {
      return "";
    }
  } else {
    return result;
  }
};

const Render = ({ item, value, rowIndex, data, id, minWidth }) => {
  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  if (id == pageId && pageId && id) {
    return <Field value={value} {...item.field} />;
  } else {
    if (item.type === "DatePicker") {
      if (value) {
        return dayjs(value).format(
          !item.field.options?.showTime?.length
            ? item.field.options.dateFormat
            : item.field.options.dateFormat + " " + item.field.options?.showTime
        );
      } else {
        return " - ";
      }
    } else if (item.type === "ColorPicker") {
      return (
        <>
          <div
            className="showColorPicker"
            style={{ background: value, minWidth: minWidth }}
          ></div>
        </>
      );
    } else if (Object.keys(item.dataSet).length !== 0) {
      if (typeof value === "object" && value) {
        return (
          <div style={{ minWidth: minWidth }}>
            {value.map((val, index) => (
              <Tag key={index}>{item.dataSet[val[item.dataKey] || val]}</Tag>
            ))}
          </div>
        );
      } else {
        return <div style={{ minWidth: minWidth }}>{item.dataSet[value]}</div>;
      }
    } else if (item.valueType === "array") {
      return (
        <div style={{ minWidth: minWidth }}>
          {value?.map((value, index) => (
            <Tag key={index}>
              {/*<Render value={value} item={item} />*/}
              {value[item.dataField] || value}
            </Tag>
          ))}
        </div>
      );
    } else {
      return <div style={{ minWidth: minWidth }}>{value}</div>;
    }
  }
};

const calculatWidth = (th, td, isFilter, sortable) => {
  console.log("🚀 ~ calculatWidth ~ isFilter:", isFilter);
  let icon = 0;
  if (isFilter) {
    icon = 28;
  }
  if (sortable) {
    icon = 30;
  }
  const thWidth = getTextWidth(
    th,
    "600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'"
  );

  if (td) {
    const tdWidth = getTextWidth(
      td,
      "600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'"
    );
    if (thWidth + icon > tdWidth) {
      return thWidth + icon;
    }
    return "auto";
  }
  if (!td) {
    return thWidth + icon;
  }
  return "auto";
};

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, "font-weight") || "normal";
  const fontSize = getCssStyle(el, "font-size") || "16px";
  const fontFamily = getCssStyle(el, "font-family") || "Times New Roman";

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}
