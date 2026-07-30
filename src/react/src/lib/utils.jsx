import React from "react";
import { Popover, Tag } from "antd";
import dayjs from "dayjs";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";

import Config, { defaultFilter } from "../constants/config";
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
      if (["DatePicker", "Slider", "Search", 'Select'].includes(col.filterType)) {
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

    // Column sizing from backend options:
    //   options.width    → fixed column width (no grow/shrink)
    //   options.minWidth → minimum width (can grow)
    //   options.maxWidth → maximum width (default 400; caps wide multi-tag cells)
    // Without any option the calculated label/content width is used as the minimum.
    const fixedWidth = col.field.options?.width ?? null;
    const optMinWidth = col.field.options?.minWidth ?? null;
    const optMaxWidth = col.field.options?.maxWidth ?? 400;

    const calcMin = calculatWidth(
      col.field.display,
      null,
      !!col.filters,
      col.field.sortable
    );

    if (fixedWidth) {
      col.width = fixedWidth;
    } else {
      col.minWidth = optMinWidth ?? calcMin;
    }

    col.render = (value, data, rowIndex) => {
      const cellCalcMin = calculatWidth(
        col.field.display,
        value,
        !!col.filters,
        col.field.sortable
      );

      const cellStyle = fixedWidth
        ? { width: fixedWidth, overflow: "hidden" }
        : { minWidth: optMinWidth ?? cellCalcMin, maxWidth: optMaxWidth };

      return (
        <div className="table-cell" style={cellStyle} title={typeof value === "string" ? value : undefined}>
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
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
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
      hideLabel={true}
      table={true}
      id={id}
      // Do not pass row as `data` — field.data is Select/Radio options.
      record={data}
      rowIndex={rowIndex}
      readonly={!(id === editingId)}
    />
  );
};

const calculatWidth = (th, td, isFilter, sortable) => {
  let icon = 0;
  if (isFilter) {
    icon += 16;
  }

  if (sortable) {
    icon += 16;
  }

  // When the table is empty td is null/undefined — fall back to a safe
  // minimum so the header at least fits its own label.
  const safeText = (td != null && td !== "" && td !== false)
    ? String(td)
    : "";

  let finallyWidth = 100;

  const headerMeasure = getTableHeaderMeasureOpts();
  const cellMeasure = getTableCellMeasureOpts();

  const thWidth = getTextWidth(th, headerMeasure.font, {
    letterSpacingEm: headerMeasure.letterSpacingEm,
    uppercase: true,
  });

  const tdWidth = getTextWidth(safeText, cellMeasure.font);

  if (tdWidth > thWidth + icon) {
    finallyWidth = tdWidth + 32; // 32px cell padding (16px each side)
    if (finallyWidth > 400) {
      finallyWidth = 400;
    }
  } else {
    finallyWidth = thWidth + icon + 32;
  }

  finallyWidth = Math.max(80, finallyWidth);

  return finallyWidth;
};

function parseLetterSpacingEm(value, fontSize) {
  const size = parseFloat(fontSize) || 14;
  if (!value) return 0;
  if (value.endsWith("em")) return parseFloat(value);
  if (value.endsWith("px")) return parseFloat(value) / size;
  return parseFloat(value) || 0;
}

function getTableHeaderMeasureOpts() {
  const root = getComputedStyle(document.documentElement);
  const fontSize =
    root.getPropertyValue("--mp-table-header-font-size").trim() || "13px";
  const fontWeight =
    root.getPropertyValue("--mp-table-header-font-weight").trim() || "600";
  const letterSpacing =
    root.getPropertyValue("--mp-table-header-letter-spacing").trim() || "0em";
  const fontFamily = getCssStyle(document.body, "font-family");

  return {
    font: `${fontWeight} ${fontSize} ${fontFamily}`,
    letterSpacingEm: parseLetterSpacingEm(letterSpacing, fontSize),
  };
}

function getTableCellMeasureOpts() {
  const root = getComputedStyle(document.documentElement);
  const fontSize =
    root.getPropertyValue("--mp-table-cell-font-size").trim() || "14px";
  const fontWeight =
    root.getPropertyValue("--mp-table-cell-font-weight").trim() || "400";
  const fontFamily = getCssStyle(document.body, "font-family");

  return {
    font: `${fontWeight} ${fontSize} ${fontFamily}`,
  };
}

function getTextWidth(text, font, { letterSpacingEm = 0, uppercase = false } = {}) {
  const displayText = uppercase ? String(text).toUpperCase() : String(text);
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  let width = context.measureText(displayText).width;

  // canvas font string does not include letter-spacing
  if (letterSpacingEm && displayText.length > 1) {
    const fontSize = parseFloat(font.match(/(\d+(?:\.\d+)?)px/)?.[1] || 14);
    width += (displayText.length - 1) * letterSpacingEm * fontSize;
  }

  return width;
}

export function getPlacementsForSearch(cols, t) {
  const searchableFields = getSearchableFromCols(cols);

  if (!searchableFields || searchableFields.length === 0) {
    return t.SEARCH_PLACEHOLDER;
  }

  return t.SEARCH_FIELDS.replace("{fields}", searchableFields);
}
export const isCustomView = () => {
  return new URLSearchParams(window.location.search).has("columns");
};

export function getSearchableFromCols(cols) {
  // Handle invalid or empty cols
  if (!cols || !Array.isArray(cols) || cols.length === 0) {
    return "";
  }

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
  const newQueryParams = {
    current: defaultFilter.current,
    pageSize: defaultFilter.pageSize,
    total: defaultFilter.total,
    search: defaultFilter.search,
    filters: {},
    sorter: {},
  };

  const current = searchParams.get("current");
  if (current) {
    newQueryParams.current = Number(current) || defaultFilter.current;
  }

  const pageSize = searchParams.get("pageSize");
  if (pageSize) {
    newQueryParams.pageSize = Number(pageSize) || defaultFilter.pageSize;
  }

  const total = searchParams.get("total");
  if (total != null) {
    newQueryParams.total = total;
  }

  const search = searchParams.get("search");
  if (search != null && search !== "") {
    newQueryParams.search = search;
  }

  const key = searchParams.get("key");
  if (key) {
    newQueryParams.key = key;
  }

  const filtersParam = searchParams.get("filters");
  if (filtersParam) {
    try {
      newQueryParams.filters = JSON.parse(decodeURIComponent(filtersParam));
    } catch (e) {
      console.error("Failed to parse filters:", e);
      newQueryParams.filters = {};
    }
  }

  const sorterParam = searchParams.get("sorter");
  if (sorterParam) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sorterParam));
      newQueryParams.sorter =
        parsed && typeof parsed === "object" && parsed.field
          ? parsed
          : {};
    } catch (e) {
      console.error("Failed to parse sorter:", e);
      newQueryParams.sorter = {};
    }
  }

  return newQueryParams;
}

export function extractFromlocalhost() {}

export function objectToQueryString(obj, columns = []) {
  if (columns === null) {
    columns = [];
  }
  const newColumns = [...columns];
  const params = new URLSearchParams();

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    if (key === "aiFilterKeys" || key === "aiQuery" || key === "aiMode") {
      // Keep AI state in memory/localStorage path only; not needed in share URL shape beyond filters
      continue;
    }

    const value = obj[key];

    if (value === null || typeof value === "undefined" || value === "") {
      continue;
    }

    if (typeof value === "object") {
      if (Array.isArray(value) && value.length === 0) continue;
      if (!Array.isArray(value) && Object.keys(value).length === 0) continue;
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, value.toString());
    }
  }

  if (newColumns.length > 0) {
    params.append(
      "columns",
      newColumns.map((column) => column.fieldName).join(",")
    );
  }

  return params.toString();
}

// Custom view / URL-driven state present?
export function hasQueryParams(newQueryParams) {
  const searchParams = new URLSearchParams(window.location.search);
  if (
    searchParams.has("columns") ||
    searchParams.has("filters") ||
    searchParams.has("sorter") ||
    searchParams.has("search") ||
    searchParams.has("current") ||
    searchParams.has("pageSize")
  ) {
    return true;
  }

  return (
    !!newQueryParams?.search ||
    Object.keys(newQueryParams?.filters || {}).length > 0 ||
    Object.keys(newQueryParams?.sorter || {}).length > 0
  );
}
