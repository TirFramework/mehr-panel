import React from "react";
import { ClearOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Typography,
  Row,
  Col,
  Skeleton,
  Space,
  Tag,
} from "antd";
import * as helpers from "../lib/helpers";
import Search from "./Search";
import AiSearch from "./AiSearch";
import CustomCol from "./CustomCol";
import Field from "../components/Field";
import Slot from "../components/Slot";
import { getPlacementsForSearch, getSearchableFromCols, isCustomView } from "../lib/utils";

const { Title } = Typography;

function toClassToken(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "");
}

function humanizeFieldLabel(value) {
  return typeof value === "string" ? value.replace(/_/g, "-") : value;
}

function filterValueTokens(val) {
  if (Array.isArray(val)) return val.filter((v) => v != null && v !== "");
  if (val && typeof val === "object") {
    return [val.from, val.to].filter((v) => v != null && v !== "");
  }
  if (val != null && val !== "") return [val];
  return [];
}

/**
 * Index chrome: title + toolbar (search / filters / create).
 * Children = IndexBody (table, cards, …).
 *
 * @param {React.ReactNode} [afterSearch] — e.g. Filter button for list view
 * @param {React.ReactNode} [belowToolbar] — e.g. filter panel under the toolbar
 * @param {boolean} [hideCustomCol] — hide column picker (list/cards)
 */
function IndexShell({
  index,
  children,
  className,
  afterSearch = null,
  belowToolbar = null,
  hideCustomCol = false,
}) {
  const {
    form,
    t,
    pageModule,
    setUrlParams,
    pageData,
    pageDataQuery,
    dataQuery,
    pagination,
    aiFilterKeys,
    aiQuery,
    aiMode,
    headerLoading,
    onSearch,
    handleClearFilters,
    handleAiFilters,
    handleAiClear,
    handleAiModeChange,
    handleColumnChange,
    removeFilterKey,
  } = index;

  return (
    <div className={`${pageModule}-index page-index${className ? ` ${className}` : ""}`}>
      <Form form={form}>
        {headerLoading ? (
          <>
            <div>
              <Skeleton.Input
                active={true}
                size="large"
                style={{ width: "200px", height: "40px", marginBottom: "16px" }}
              />
            </div>
            <div>
              <Skeleton.Input
                active={true}
                size="large"
                style={{
                  width: "calc(100vw - 350px)",
                  height: "46px",
                  marginBottom: "16px",
                }}
              />
            </div>
          </>
        ) : (
          <>
            <Title className="page-index__title">
              {pageData?.configs?.module_title}{" "}
              {isCustomView() && (
                <small style={{ fontSize: "50%" }}>
                  <Button
                    icon={<ClearOutlined />}
                    type="link"
                    size="large"
                    danger
                    onClick={() => {
                      setUrlParams({});
                    }}
                  >
                    {t.CUSTOM_VIEW}
                  </Button>
                </small>
              )}
            </Title>

            <Row
              align="bottom"
              className="page-index__header"
              justify="space-between"
              wrap={false}
            >
              <Col flex="auto" className="gutter-row" style={{ minWidth: 0 }}>
                <Space wrap>
                  {pageData?.configs?.ai_search && (
                    <AiSearch
                      module={pageModule}
                      onFilters={handleAiFilters}
                      onClear={handleAiClear}
                      onModeChange={handleAiModeChange}
                      activeFilters={Object.fromEntries(
                        aiFilterKeys
                          .map((k) => [k, pagination.filters?.[k]])
                          .filter(([, v]) => v != null)
                      )}
                      initialQuery={aiQuery}
                      initialOpen={aiMode}
                    />
                  )}

                  {(!aiMode || !pageData?.configs?.ai_search) &&
                    !!getSearchableFromCols(pageData?.cols) && (
                    <Search
                      loading={dataQuery.isLoading}
                      value={pagination?.search}
                      onSearch={onSearch}
                      placeholder={getPlacementsForSearch(pageData?.cols, t)}
                    />
                  )}

                  {afterSearch}

                  {!hideCustomCol && pageData?.cols?.length > 0 && (
                    <CustomCol
                      column={[...pageData.cols]}
                      onChange={handleColumnChange}
                    />
                  )}

                  {(helpers.notEmpty(pagination?.filters) ||
                    pagination.search ||
                    helpers.notEmpty(pagination?.sorter)) && (
                      <Button
                        icon={<ClearOutlined />}
                        type="primary"
                        size="large"
                        danger
                        className="page-index__clear-filters"
                        onClick={handleClearFilters}
                      />
                    )}

                  {(aiFilterKeys.length > 0 ||
                    Object.keys(pagination.filters || {}).filter(
                      (k) => !aiFilterKeys.includes(k)
                    ).length > 0) && (
                      <span
                        style={{
                          display: "inline-flex",
                          flexWrap: "wrap",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        {[
                          ...aiFilterKeys.map((k) => ({
                            key: k,
                            color: "purple",
                            isAi: true,
                          })),
                          ...Object.keys(pagination.filters || {})
                            .filter((k) => !aiFilterKeys.includes(k))
                            .map((k) => ({ key: k, color: "blue", isAi: false })),
                        ].map(({ key, color, isAi }) => {
                          const col = pageData?.cols?.find(
                            (c) => c.fieldName === key
                          );
                          const rawTitle =
                            typeof col?.title === "string"
                              ? col.title
                              : (col?.title?.props?.title ??
                                (typeof col?.title?.props?.children === "string"
                                  ? col.title.props.children
                                  : null) ??
                                key);
                          const titleText = humanizeFieldLabel(rawTitle);
                          const val = pagination.filters?.[key];
                          const getLabel = (v) =>
                            col?.filters?.find(
                              (f) => String(f.value) === String(v)
                            )?.label ?? v;
                          const display = Array.isArray(val)
                            ? val.slice(0, 3).map(getLabel).join(", ") +
                            (val.length > 3 ? " …" : "")
                            : val && typeof val === "object"
                              ? val.from && val.to
                                ? `${val.from} – ${val.to}`
                                : val.to
                                  ? `≤ ${val.to}`
                                  : val.from
                                    ? `≥ ${val.from}`
                                    : ""
                              : getLabel(val);
                          const filterToken = toClassToken(key);
                          const valueTokens = filterValueTokens(val)
                            .map(toClassToken)
                            .filter(Boolean);
                          return (
                            <Tag
                              key={key}
                              color={color}
                              closable
                              onClose={() => removeFilterKey(key, isAi)}
                              className={[
                                "page-index__filter-tag",
                                filterToken &&
                                `page-index__filter-tag--${filterToken}`,
                                ...valueTokens.map(
                                  (v) => `page-index__filter-tag--value-${v}`
                                ),
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                              <strong
                                className={[
                                  "page-index__filter-tag__label",
                                  filterToken &&
                                  `page-index__filter-tag__label--${filterToken}`,
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              >
                                {titleText}
                                {display ? ": " : ""}
                              </strong>
                              {display ? (
                                <span
                                  className={[
                                    "page-index__filter-tag__value",
                                    ...valueTokens.map(
                                      (v) =>
                                        `page-index__filter-tag__value--${v}`
                                    ),
                                  ].join(" ")}
                                >
                                  {display}
                                </span>
                              ) : null}
                            </Tag>
                          );
                        })}
                      </span>
                    )}
                </Space>
              </Col>
              <Col flex="none" className="gutter-row page-index__actions">
                <Space>
                  <Slot name="IndexToolbar" pageModule={pageModule} />
                  {pageData?.buttons?.map((btn, index) => (
                    <Field
                      {...btn}
                      key={`btn-${btn.name ?? btn.action ?? index}-${index}`}
                      type={btn.action}
                      form={form}
                      loading={pageDataQuery.isLoading}
                      actions={pageData?.configs?.ed}
                    />
                  ))}
                </Space>
              </Col>
            </Row>
          </>
        )}

        {belowToolbar}

        {children}
      </Form>
    </div>
  );
}

export default IndexShell;
