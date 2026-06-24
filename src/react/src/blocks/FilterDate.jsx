import React from "react";
import { Button, Col, DatePicker, Divider, Input, Row, Slider } from "antd";
import dayjs from "dayjs";

import FilterCheckboxList from "./FilterCheckboxList";
import { useLanguage } from "../context/LanguageContext";

function FilterDate({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  filters,
  filtersType,
  data,
}) {
  const { t } = useLanguage();

  const getMarks = (d) => {
    const transformedObject = {};

    for (const item of d) {
      transformedObject[Number(item.value)] = item.label;
    }

    return transformedObject;
  };

  const getMin = (d) => {
    return d[0].value;
  };

  const getMax = (d) => {
    return d[d.length - 1].value;
  };

  const hasSelection = Array.isArray(selectedKeys)
    ? selectedKeys.length > 0
    : selectedKeys != null && selectedKeys !== "";

  return (
    <div
      className={`custom-filter${filtersType === "Select" ? " custom-filter--select" : ""}`}
    >
      <>
        {filtersType === "DatePicker" && (
          <DatePicker.RangePicker
            // format={"DD-MM-YY"}
            size="small"
            value={
              selectedKeys.length > 0
                ? [dayjs(selectedKeys[0]), dayjs(selectedKeys[1])]
                : null
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

      {filtersType === "Slider" && (
        <div style={{ padding: "0 16px" }}>
          <Slider
            size={"small"}
            style={{ width: "200px" }}
            min={getMin(data)}
            max={getMax(data)}
            range
            marks={getMarks(data)}
            value={
              selectedKeys.length > 0
                ? selectedKeys
                : [getMin(data), getMax(data)]
            }
            onChange={(val) => {
              setSelectedKeys(val);
            }}
          />
        </div>
      )}
      {filtersType === "Search" && (
        <>
          <Input
            value={selectedKeys}
            placeholder={t.SEARCH}
            size="small"
            onChange={(e) => {
              setSelectedKeys(e.target.value);
            }}
          />
        </>
      )}

      {filtersType === "Select" && (
        <FilterCheckboxList
          data={data}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
      )}

      
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
    </div>
  );
}

export default FilterDate;
