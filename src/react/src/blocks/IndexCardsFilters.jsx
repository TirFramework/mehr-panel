import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Row, Select } from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import FilterDate from "./FilterDate";
import { useLanguage } from "../context/LanguageContext";
import * as helpers from "../lib/helpers";

function columnTitle(col) {
  if (typeof col.title === "string") return col.title;
  return col.title?.props?.title ?? col.fieldName ?? col.dataIndex;
}

function emptySelection(filterType) {
  return [];
}

function normalizeSelected(value, filterType) {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function isEmptyValue(keys) {
  return (
    keys == null ||
    keys === "" ||
    (Array.isArray(keys) && keys.length === 0)
  );
}

function buildDraftFromPagination(filterableCols, filters) {
  const draft = {};
  filterableCols.forEach((col) => {
    draft[col.fieldName] = normalizeSelected(
      filters?.[col.fieldName],
      col.filterType
    );
  });
  return draft;
}

function encodeSortValue(field, order) {
  return `${field}|${order}`;
}

function decodeSortValue(value) {
  if (!value || typeof value !== "string") return null;
  const i = value.lastIndexOf("|");
  if (i <= 0) return null;
  const field = value.slice(0, i);
  const order = value.slice(i + 1);
  if (order !== "ascend" && order !== "descend") return null;
  return { field, order };
}

/**
 * Sort control for list/cards view (writes pagination.sorter like the table).
 */
export function useIndexCardsSort(index) {
  const { t } = useLanguage();
  const { pageData, pagination, setPagination, pageModule } = index;

  const sortableCols = useMemo(
    () =>
      (pageData?.cols || []).filter(
        (col) => col.sorter === true || col.field?.sortable === true
      ),
    [pageData?.cols]
  );

  if (!sortableCols.length) {
    return { hasSort: false, control: null };
  }

  const active =
    pagination?.sorter?.field && pagination?.sorter?.order
      ? encodeSortValue(pagination.sorter.field, pagination.sorter.order)
      : undefined;

  const options = sortableCols.flatMap((col) => {
    const title = columnTitle(col);
    const field = col.fieldName;
    return [
      {
        value: encodeSortValue(field, "ascend"),
        label: (
          <span>
            <SortAscendingOutlined /> {title}
          </span>
        ),
      },
      {
        value: encodeSortValue(field, "descend"),
        label: (
          <span>
            <SortDescendingOutlined /> {title}
          </span>
        ),
      },
    ];
  });

  const onChange = (value) => {
    const next = decodeSortValue(value);
    setPagination({
      ...pagination,
      sorter: next || {},
      current: 1,
      key: pageModule,
    });
  };

  const control = (
    <Select
      allowClear
      size="large"
      placeholder={t.SORT}
      value={active}
      options={options}
      onChange={onChange}
      style={{ minWidth: 180 }}
      popupMatchSelectWidth={false}
    />
  );

  return { hasSort: true, control };
}

/**
 * Column-filter state for list/cards view.
 * Returns toolbar button + expandable panel (apply-all).
 */
export function useIndexCardsFilters(index) {
  const { t } = useLanguage();
  const {
    pageData,
    pagination,
    setPagination,
    pageModule,
    handleClearFilters,
  } = index;

  const [open, setOpen] = useState(false);

  const filterableCols = useMemo(
    () =>
      (pageData?.cols || []).filter(
        (col) =>
          col.filters !== undefined &&
          ["DatePicker", "Slider", "Search", "Select"].includes(col.filterType)
      ),
    [pageData?.cols]
  );

  const [draft, setDraft] = useState(() =>
    buildDraftFromPagination(filterableCols, pagination?.filters)
  );

  useEffect(() => {
    if (open) {
      setDraft(buildDraftFromPagination(filterableCols, pagination?.filters));
    }
  }, [open, filterableCols, pagination?.filters]);

  const activeCount = filterableCols.filter((col) => {
    const v = pagination?.filters?.[col.fieldName];
    return helpers.notEmpty(v) || (typeof v === "string" && v !== "");
  }).length;

  if (!filterableCols.length) {
    return { hasFilters: false, button: null, panel: null };
  }

  const setFieldDraft = (fieldName, keys) => {
    setDraft((prev) => ({ ...prev, [fieldName]: keys }));
  };

  const applyAll = () => {
    // Keep non-panel filters (e.g. AI); only replace panel field keys.
    const filters = { ...(pagination.filters || {}) };
    const panelFields = new Set(filterableCols.map((col) => col.fieldName));

    panelFields.forEach((fieldName) => {
      delete filters[fieldName];
    });

    filterableCols.forEach((col) => {
      const keys = draft[col.fieldName];
      if (!isEmptyValue(keys)) {
        filters[col.fieldName] = keys;
      }
    });

    setPagination({
      ...pagination,
      filters,
      current: 1,
      key: pageModule,
    });
    setOpen(false);
  };

  const resetAll = () => {
    const cleared = {};
    filterableCols.forEach((col) => {
      cleared[col.fieldName] = emptySelection(col.filterType);
    });
    setDraft(cleared);
    handleClearFilters();
  };

  const button = (
    <Button
      icon={<FilterOutlined />}
      size="large"
      type={open || activeCount > 0 ? "primary" : "default"}
      onClick={() => setOpen((v) => !v)}
    >
      {t.FILTER}
      {activeCount > 0 ? ` (${activeCount})` : ""}
    </Button>
  );

  const panel = open ? (
    <Card
      size="small"
      className="index-cards-filters"
      title={t.FILTER}
      style={{ marginBottom: 16 }}
      extra={
        <Button type="text" onClick={() => setOpen(false)}>
          {t.CLOSE}
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        {filterableCols.map((col) => (
          <Col key={col.fieldName} xs={24} sm={12} lg={8} xl={6}>
            <div className="index-cards-filters__item">
              <div
                style={{
                  fontWeight: 500,
                  marginBottom: 8,
                  fontSize: 13,
                }}
              >
                {columnTitle(col)}
              </div>
              <FilterDate
                hideActions
                filtersType={col.filterType}
                data={col.filters}
                selectedKeys={
                  draft[col.fieldName] ?? emptySelection(col.filterType)
                }
                setSelectedKeys={(keys) => setFieldDraft(col.fieldName, keys)}
                confirm={() => {}}
                clearFilters={() => {}}
                close={() => {}}
              />
            </div>
          </Col>
        ))}
      </Row>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 16,
        }}
      >
        <Button onClick={resetAll}>{t.RESET_ALL}</Button>
        <Button type="primary" onClick={applyAll}>
          {t.APPLY_FILTERS}
        </Button>
      </div>
    </Card>
  ) : null;

  return { hasFilters: true, button, panel };
}

/** @deprecated Prefer useIndexCardsFilters + IndexShell afterSearch */
function IndexCardsFilters({ index }) {
  const { button, panel, hasFilters } = useIndexCardsFilters(index);
  if (!hasFilters) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: panel ? 12 : 0 }}>{button}</div>
      {panel}
    </div>
  );
}

export default IndexCardsFilters;
