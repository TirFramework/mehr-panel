import React, { useMemo, useCallback, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Row,
  Table,
  Form,
  Typography,
  Col,
  Skeleton,
  Space,
  Spin,
  Tag,
  Flex,
} from "antd";
import * as helpers from "../lib/helpers";
import { useGetColumns, useGetData } from "../Request";
import Config, { defaultFilter } from "../constants/config";
import Search from "../blocks/Search";
import AiSearch from "../blocks/AiSearch";
import CustomCol from "../blocks/CustomCol";
import Export from "../blocks/Export";
import useGetParams from "../hooks/useGetParams";
import { useTableColumns } from "../hooks/useTableColumns";
import {
  getPlacementsForSearch,
  isCustomView,
} from "../lib/utils";
import { useLanguage } from "../context/LanguageContext";
import NotFoundPage from "./NotFoundPage";

const { Title } = Typography;

function Index() {
  const [form] = Form.useForm();
  const { t } = useLanguage();
  const { pageModule } = useParams();
  const [urlParams, setUrlParams] = useSearchParams();
  const pageId = urlParams.get("id");

  const [pagination, setPagination] = useGetParams(pageModule, {
    ...defaultFilter,
    key: pageModule,
  });

  // aiFilterKeys, aiQuery, and aiMode live inside pagination so useGetParams persists
  // them to localStorage — all three survive page refresh and navigation.
  const aiFilterKeys = pagination.aiFilterKeys ?? [];
  const aiQuery = pagination.aiQuery ?? "";

  // aiMode: restore from localStorage if set, otherwise open if there are persisted AI filters
  const [aiMode, setAiMode] = useState(() =>
    pagination.aiMode !== undefined ? pagination.aiMode : aiFilterKeys.length > 0
  );

  const { data: pageData, ...pageDataQuery } = useGetColumns(
    pageModule,
    pagination
  );

  // Use custom hook for column management
  const columns = useTableColumns(pageData, pagination, form);

  const isEditing = useCallback((record) => record.key === pageId, [pageId]);

  const { data: indexData, ...dataQuery } = useGetData(
    pagination?.key || pageModule,
    pagination,
    {
      enabled: !!pagination?.key,
    }
  );

  const handleChangeTable = useCallback(
    (p, filters, sorter) => {
      filters = helpers.removeNullFromObject(filters);
      // When sort is cleared, sorter.column is undefined — avoid storing
      // { field: undefined, order: undefined } which notEmpty() treats as
      // non-empty and keeps the clear button visible incorrectly.
      const orderBy = sorter?.column
        ? { field: sorter.column.fieldName, order: sorter.order }
        : {};

      setPagination({
        ...pagination,
        current: p.current,
        pageSize: p.pageSize,
        filters: filters,
        key: pageModule,
        sorter: orderBy,
      });
    },
    [pagination, pageModule, setPagination]
  );

  const onSearch = useCallback(
    (value) => {
      const searchValue = value === "" ? null : value;
      setPagination({
        ...pagination,
        search: searchValue,
        current: 1,
        key: pageModule,
      });
    },
    [pagination, pageModule, setPagination]
  );

  const handleClearFilters = useCallback(() => {
    // Keep aiMode when clearing filters — user may have activated AI search
    setPagination({ ...defaultFilter, aiFilterKeys: [], aiQuery: "", aiMode: aiMode, key: pageModule });
  }, [pageModule, setPagination, aiMode]);

  // AI returned new filters — remove previous AI keys first, then merge new ones in
  const handleAiFilters = useCallback(
    (filters, query) => {
      const base = { ...(pagination.filters || {}) };
      // remove whatever AI set last time
      aiFilterKeys.forEach((k) => delete base[k]);
      // apply new AI filters on top of manual filters
      setPagination({
        ...pagination,
        current: 1,
        filters: { ...base, ...filters },
        aiFilterKeys: Object.keys(filters),
        aiQuery: query,
        aiMode: true,
        key: pageModule,
      });
    },
    [pagination, pageModule, setPagination, aiFilterKeys]
  );

  // Remove only the AI-set keys from filters, leave manual filters intact
  const handleAiClear = useCallback(() => {
    const newFilters = { ...(pagination.filters || {}) };
    aiFilterKeys.forEach((k) => delete newFilters[k]);
    // Keep aiMode when clearing only AI filters — user may want to search again
    setPagination({ ...pagination, current: 1, filters: newFilters, aiFilterKeys: [], aiQuery: "", aiMode: aiMode, key: pageModule });
  }, [pagination, pageModule, setPagination, aiFilterKeys, aiMode]);

  const handleAiModeChange = useCallback((active) => {
    setAiMode(active);
    // Persist aiMode to localStorage so it survives page refresh
    setPagination({ ...pagination, aiMode: active, key: pageModule });
  }, [pagination, pageModule, setPagination]);

  const handleColumnChange = useCallback(
    (newCol) => {
      // This will be handled by the useTableColumns hook
      // We just need to trigger a re-render
      setPagination((prev) => ({ ...prev }));
    },
    [setPagination]
  );

  const mergedColumns = useMemo(() => {
    return columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
  }, [columns, isEditing]);

  if (pageDataQuery.isError && pageDataQuery.error?.response?.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <div className={`${pageModule}-index page-index`}>
      <Form
        form={form}
      // disabled={!(pageId === restProps["data-row-key"])}
      >
        {pageDataQuery.isLoading && !pageData ? (
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
                <>
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
                </>
              )}
            </Title>

            <Row
              align="bottom"
              className="page-index__header"
              justify={"space-between"}
            >
              <Col className="gutter-row">
                <Space>
                  <>
                    {pageData?.configs?.ai_search && (
                      <AiSearch
                        module={pageModule}
                        onFilters={handleAiFilters}
                        onClear={handleAiClear}
                        onModeChange={handleAiModeChange}
                        activeFilters={Object.fromEntries(aiFilterKeys.map((k) => [k, pagination.filters?.[k]]).filter(([, v]) => v != null))}
                        initialQuery={aiQuery}
                        initialOpen={aiMode}
                      />
                    )}

                    {(!aiMode || !pageData?.configs?.ai_search) && (
                      <Search
                        loading={dataQuery.isLoading}
                        value={pagination?.search}
                        onSearch={onSearch}
                        placeholder={getPlacementsForSearch(pageData?.cols)}
                      />
                    )}



                    {pageData?.cols.length && (
                      <CustomCol
                        column={[...pageData?.cols]}
                        onChange={handleColumnChange}
                      />
                    )}
                  </>
                  <>
                    {(helpers.notEmpty(pagination?.filters) ||
                      pagination.search ||
                      helpers.notEmpty(pagination?.sorter)) && (
                        <>
                          {!isCustomView() && (
                            <Button
                              icon={<ClearOutlined />}
                              type="primary"
                              size="large"
                              danger
                              onClick={handleClearFilters}
                            />
                          )}
                        </>
                      )}
                  </>

                  {/* Filter tags — inline with toolbar */}
                  {(aiFilterKeys.length > 0 ||
                    Object.keys(pagination.filters || {}).filter((k) => !aiFilterKeys.includes(k)).length > 0) && (
                      <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                        {[
                          ...aiFilterKeys.map((k) => ({ key: k, color: "purple", isAi: true })),
                          ...Object.keys(pagination.filters || {}).filter((k) => !aiFilterKeys.includes(k)).map((k) => ({ key: k, color: "blue", isAi: false })),
                        ].map(({ key, color, isAi }) => {
                          const col = pageData?.cols?.find((c) => c.fieldName === key);
                          const titleText = typeof col?.title === "string"
                            ? col.title
                            : col?.title?.props?.title ?? col?.title?.props?.children ?? key;
                          const val = pagination.filters?.[key];
                          const getLabel = (v) => col?.filters?.find((f) => String(f.value) === String(v))?.label ?? v;
                          const display = Array.isArray(val)
                            ? val.slice(0, 3).map(getLabel).join(", ") + (val.length > 3 ? " …" : "")
                            : val && typeof val === "object"
                              ? val.from && val.to ? `${val.from} – ${val.to}` : val.to ? `≤ ${val.to}` : val.from ? `≥ ${val.from}` : ""
                              : getLabel(val);
                          return (
                            <Tag key={key} color={color} closable onClose={() => {
                              const f = { ...(pagination.filters || {}) };
                              delete f[key];
                              setPagination({
                                ...pagination,
                                filters: f,
                                aiFilterKeys: isAi ? aiFilterKeys.filter((k) => k !== key) : aiFilterKeys,
                                key: pageModule,
                              });
                            }} style={{ margin: 0, fontSize: 10 }}>
                              <strong>{titleText}{display ? ": " : ""}</strong>{display}
                            </Tag>
                          );
                        })}
                      </span>
                    )}

                </Space>
              </Col>
              <Col className="gutter-row text-right">
                <Space>
                  {pageData?.configs?.actions?.create && (
                    <Link to={`/${Config.perfix}/${pageModule}/create-edit`}>
                      <Button
                        size="large"
                        type="primary"
                        icon={<PlusOutlined />}
                        loading={pageDataQuery.isLoading}
                      >
                        <span className="create-text">
                          {pageData?.configs?.module_title}
                        </span>
                      </Button>
                    </Link>
                  )}
                </Space>
              </Col>
            </Row>


          </>
        )}
        <Card className="index-page__card">
          {pageDataQuery.isLoading && !pageData ? (
            <div className="table-loading">
              <div className="table-loading__header">
                <Skeleton.Input
                  active={true}
                  size="large"
                  style={{
                    width: "100%",
                    height: "55px",
                  }}
                />
              </div>
              <div className="table-loading__body">
                <Spin />
              </div>
              <div className="table-loading__footer">
                <Skeleton.Input
                  active={true}
                  size="large"
                  style={{
                    width: "100px",
                    height: "32px",
                  }}
                />
                <Skeleton.Input
                  active={true}
                  size="large"
                  style={{
                    width: "400px",
                    height: "32px",
                  }}
                />
              </div>
            </div>
          ) : (
            <Table
              tableLayout={"auto"}
              // tableLayout={"fixed"}
              scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
              columns={mergedColumns}
              rowKey={(record) => record.id || record._id}
              dataSource={indexData?.data}
              noDataContent={
                helpers.notEmpty(pagination?.filters) || pagination?.search
                  ? "remove filter "
                  : "nodata"
              }
              // components={{
              //   header: {
              //     cell: (headerCell, data) => {
              //       return (
              //         <th
              //           className={headerCell.className}
              //           style={headerCell.style}
              //         >
              //           <Tooltip
              //             placement="left"
              //             overlayClassName="table_tooltip"
              //             title={<div>{headerCell.children}</div>}
              //           >
              //             <div>{headerCell.children}</div>
              //           </Tooltip>
              //         </th>
              //       );
              //     },
              //   },
              // }}
              pagination={{
                pageSize: pagination?.pageSize,
                current: pagination?.current,
                pageSizeOptions: ["10", "15", "30", "50", "100", "500"],
                total: indexData?.total,
                showTotal: (total) => (
                  <>
                    <Row justify={"space-between"}>
                      <Col>
                        <Export
                          loading={dataQuery.isLoading || dataQuery.isFetching}
                          data={indexData?.data}
                          columns={columns}
                          pagination={pagination}
                        />
                      </Col>
                      <Col>
                        <Button>Total: {indexData?.total}</Button>
                      </Col>
                    </Row>
                  </>
                ),
              }}
              loading={dataQuery.isLoading && !indexData}
              onChange={handleChangeTable}
            />
          )}
        </Card>
      </Form>
    </div>
  );
}

export default Index;
