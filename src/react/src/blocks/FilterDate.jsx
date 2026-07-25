import React from "react";
import { Button, Col, DatePicker, Divider, Input, Row, Slider } from "antd";
import dayjs from "dayjs";

import FilterCheckboxList from "./FilterCheckboxList";
import { useLanguage } from "../context/LanguageContext";

function asKeysArray(selectedKeys) {
  if (Array.isArray(selectedKeys)) return selectedKeys;
  if (selectedKeys == null || selectedKeys === "") return [];
  return [selectedKeys];
}

function FilterDate({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  filters,
  filtersType,
  data,
  hideActions = false,
}) {
  const { t } = useLanguage();
  const keys = asKeysArray(selectedKeys);

  const getMarks = (d) => {
    const transformedObject = {};
    if (!Array.isArray(d)) return transformedObject;

    for (const item of d) {
      if (item?.value == null) continue;
      transformedObject[Number(item.value)] = item.label;
    }

    return transformedObject;
  };

  const getMin = (d) => {
    if (!Array.isArray(d) || d.length === 0) return 0;
    return Number(d[0]?.value) || 0;
  };

  const getMax = (d) => {
    if (!Array.isArray(d) || d.length === 0) return 0;
    return Number(d[d.length - 1]?.value) || 0;
  };

  const hasSelection = keys.length > 0;

  const sliderReady =
    Array.isArray(data) &&
    data.length > 0 &&
    data[0]?.value != null &&
    data[data.length - 1]?.value != null;

  return (
    <div
      className={`custom-filter${filtersType === "Select" ? " custom-filter--select" : ""}`}
    >
      <>
        {filtersType === "DatePicker" && (
          <DatePicker.RangePicker
            size="small"
            value={
              keys.length > 0 ? [dayjs(keys[0]), dayjs(keys[1])] : null
            }
            onChange={(dates) => {
              setSelectedKeys(
                dates
                  ? [
                      dates[0].startOf("day").toISOString(),
                      dates[1].endOf("day").toISOString(),
                    ]
                  : []
              );
            }}
            allowClear={false}
          />
        )}
      </>

      {filtersType === "Slider" && sliderReady && (
        <div style={{ padding: "0 16px" }}>
          <Slider
            size={"small"}
            style={{ width: "200px" }}
            min={getMin(data)}
            max={getMax(data)}
            range
            marks={getMarks(data)}
            value={keys.length > 0 ? keys : [getMin(data), getMax(data)]}
            onChange={(val) => {
              setSelectedKeys(val);
            }}
          />
        </div>
      )}
      {filtersType === "Slider" && !sliderReady && (
        <div style={{ padding: "8px 0", color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
          {t.FILTER_NO_ITEMS}
        </div>
      )}
      {filtersType === "Search" && (
        <>
          <Input
            value={keys[0] ?? ""}
            placeholder={t.SEARCH}
            size="small"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKeys(value === "" ? [] : [value]);
            }}
            onPressEnter={() => {
              if (hideActions) return;
              confirm();
              close();
            }}
          />
        </>
      )}

      {filtersType === "Select" && (
        <FilterCheckboxList
          data={data}
          selectedKeys={keys}
          setSelectedKeys={setSelectedKeys}
        />
      )}

      {!hideActions && (
        <>
          <div>
            <Divider style={{ margin: "8px" }} />
          </div>
          <Row justify={"space-between"}>
            <Col>
              <Button
                type="link"
                size="small"
                disabled={!hasSelection}
                onClick={() => {
                  clearFilters();
                }}
              >
                {t.RESET}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  confirm();
                  close();
                }}
              >
                {t.FILTER}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default FilterDate;
