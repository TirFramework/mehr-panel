import React from "react";
import { Popover, Tag } from "antd";
import dayjs from "dayjs";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";

import { useSearchParams } from "react-router-dom";
import Config from "../constants/config";
import Field from "../components/Field";
import FilterDate from "../blocks/FilterDate";
import { useEditing } from "../context/EditingContext";
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
      // col.filterMode = "tree";
      // col.filterMultiple = false;
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
        <div
          style={{
            minWidth:
              col.field.options?.minWidth ||
              calculatWidth(
                col.field.display,
                value,
                !!col.filters,
                col.field.sortable
              ),
          }}
        >
          <Render
            value={value}
            item={col}
            data={data}
            rowIndex={rowIndex}
            id={data[interactionCharacter]}
          />
        </div>
      );
    };

    col.title = (
      <div
        title={col.title}
        // style={{
        //   minWidth:
        //     col.field.options?.minWidth ||
        //     calculatWidth(col.field.display, null, false, false),
        // }}
      >
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
  const { editingId } = useEditing();

  return (
    <Field
      value={value}
      {...item.field}
      hideLable={true}
      table={true}
      // 2. تغییر شرط readonly برای استفاده از editingId
      readonly={!(id === editingId)}
    />
  );
};

const calculatWidth = (th, td, isFilter, sortable) => {
  // console.log("🚀 ~ calculatWidth ~ th:", th);
  let icon = 0;
  if (isFilter) {
    icon = 28;
  }

  if (sortable) {
    icon = 30;
  }

  let finallyWidth = 100;

  const thWidth = getTextWidth(
    th,
    "600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'"
  );

  const tdWidth = getTextWidth(
    td,
    "600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'"
  );

  if (tdWidth > thWidth + icon) {
    finallyWidth = tdWidth;
    if (tdWidth > 400) {
      finallyWidth = 400;
    }
  } else {
    finallyWidth = thWidth + icon;
  }

  // console.log("🚀 ~ calculatWidth ~ thWidth:", thWidth);
  return finallyWidth;
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

export function getPlacementsForSearch(cols) {
  const searchableFields = getSearchableFromCols(cols);

  //TODO: add translate
  if (!searchableFields) {
    return "No searchable fields";
  }

  //TODO: add translate
  return `${searchableFields}`;
}
export const isCustomView = () => {
  const newQueryParams = extractQueryParams();
  if (hasQueryParams(newQueryParams)) {
    return true;
  }
  return false;
};

export function getSearchableFromCols(cols) {
  const newCols = [...cols];
  const searchableFields = [];

  newCols.forEach((col) => {
    if (col.field && col.field.searchable) {
      searchableFields.push(col.field.display);
    }
  });

  return searchableFields.join(", ");
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

export function extractQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const newQueryParams = {};

  newQueryParams.current = Number(searchParams.get("current"));
  newQueryParams.pageSize = Number(searchParams.get("pageSize"));
  newQueryParams.total = searchParams.get("total");
  newQueryParams.search = searchParams.get("search");
  newQueryParams.key = searchParams.get("key");

  const filtersParam = searchParams.get("filters");
  if (filtersParam) {
    try {
      newQueryParams.filters = JSON.parse(decodeURIComponent(filtersParam));
    } catch (e) {
      console.error("Failed to parse filters:", e);
      newQueryParams.filters = {};
    }
  } else {
    newQueryParams.filters = {};
  }

  const sorterParam = searchParams.get("sorter");
  if (sorterParam) {
    try {
      newQueryParams.sorter = JSON.parse(decodeURIComponent(sorterParam));
    } catch (e) {
      console.error("Failed to parse sorter:", e);
      newQueryParams.sorter = {};
    }
  } else {
    newQueryParams.sorter = {};
  }

  return newQueryParams;
}

export function extractFromlocalhost() {}

export function objectToQueryString(obj, columns = []) {
  if(columns === null){
    columns = []
  }
  const newColumns = [...columns];
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value === null || typeof value === "undefined") {
        continue;
      }

      if (typeof value === "object") {
        const jsonString = JSON.stringify(value);
        params.append(key, jsonString);
      } else {
        // برای مقادیر ساده (رشته، عدد، boolean)
        params.append(key, value.toString());
      }
    }
  }

  console.log("🚀 ~ objectToQueryString ~ columns:", newColumns);
  params.append(
    "columns",
    newColumns.map((column) => column.fieldName).join(",")
  );
  return params.toString();
}

// تابع بررسی وجود پارامترهای جستجو
export function hasQueryParams(newQueryParams) {
  return (
    newQueryParams.current ||
    newQueryParams.pageSize ||
    newQueryParams.total ||
    newQueryParams.search ||
    // newQueryParams.key ||
    Object.keys(newQueryParams.filters).length > 0 ||
    Object.keys(newQueryParams.sorter).length > 0
  );
}
