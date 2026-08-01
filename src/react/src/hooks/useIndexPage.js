import { useMemo, useCallback, useState } from "react";
import { Form } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import * as helpers from "../lib/helpers";
import { useGetColumns, useGetData } from "../Request";
import { defaultFilter } from "../constants/config";
import useGetParams from "./useGetParams";
import { useTableColumns } from "./useTableColumns";
import { useLanguage } from "../context/LanguageContext";
import useDocumentTitle from "./useDocumentTitle";
import { getLoadBlockedStatus, isQueryLoadBlocked } from "../lib/queryErrors";

/**
 * Index list logic only — pagination, filters, search, columns, rows.
 * Pair with IndexShell + IndexBody (table / cards / custom).
 */
export default function useIndexPage() {
  const [form] = Form.useForm();
  const { t } = useLanguage();
  const { pageModule } = useParams();
  const [urlParams, setUrlParams] = useSearchParams();
  const pageId = urlParams.get("id");

  const [pagination, setPagination] = useGetParams(pageModule, {
    ...defaultFilter,
    key: pageModule,
  });

  const aiFilterKeys = pagination.aiFilterKeys ?? [];
  const aiQuery = pagination.aiQuery ?? "";

  const [aiMode, setAiMode] = useState(() =>
    pagination.aiMode !== undefined
      ? pagination.aiMode
      : aiFilterKeys.length > 0
  );

  const { data: pageData, ...pageDataQuery } = useGetColumns(
    pageModule,
    pagination,
    {
      enabled: !!pageModule,
    }
  );

  useDocumentTitle(
    pageDataQuery.isLoading ? t.LOADING : pageData?.configs?.module_title
  );

  const columns = useTableColumns(pageData, pagination, form);

  const isEditing = useCallback(
    (record) => record.key === pageId,
    [pageId]
  );

  const columnsBlocked = isQueryLoadBlocked(pageDataQuery);

  const { data: indexData, ...dataQuery } = useGetData(
    pagination?.key || pageModule,
    pagination,
    {
      // Wait for columns OK — don't hammer /data after a 403/404/500 on the module
      enabled:
        !!pagination?.key &&
        pageDataQuery.isSuccess &&
        !columnsBlocked,
    }
  );

  const handleChangeTable = useCallback(
    (p, filters, sorter, extra) => {
      filters = helpers.removeNullFromObject(filters);
      const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;

      let orderBy = {};
      if (sorterObj?.order) {
        const field =
          sorterObj.column?.fieldName ??
          (typeof sorterObj.field === "string" ? sorterObj.field : null);
        if (field) {
          orderBy = { field, order: sorterObj.order };
        }
      } else if (
        extra?.action === "paginate" ||
        extra?.action === "filter"
      ) {
        // Keep active sort when only page/filters change
        orderBy =
          pagination?.sorter?.field && pagination?.sorter?.order
            ? pagination.sorter
            : {};
      }
      // else: user cleared sort (action === "sort" without order)

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
    setPagination({
      ...defaultFilter,
      aiFilterKeys: [],
      aiQuery: "",
      aiMode: aiMode,
      key: pageModule,
    });
  }, [pageModule, setPagination, aiMode]);

  const handleAiFilters = useCallback(
    (filters, query) => {
      const base = { ...(pagination.filters || {}) };
      aiFilterKeys.forEach((k) => delete base[k]);
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

  const handleAiClear = useCallback(() => {
    const newFilters = { ...(pagination.filters || {}) };
    aiFilterKeys.forEach((k) => delete newFilters[k]);
    setPagination({
      ...pagination,
      current: 1,
      filters: newFilters,
      aiFilterKeys: [],
      aiQuery: "",
      aiMode: aiMode,
      key: pageModule,
    });
  }, [pagination, pageModule, setPagination, aiFilterKeys, aiMode]);

  const handleAiModeChange = useCallback(
    (active) => {
      setAiMode(active);
      setPagination({ ...pagination, aiMode: active, key: pageModule });
    },
    [pagination, pageModule, setPagination]
  );

  const handleColumnChange = useCallback(() => {
    setPagination((prev) => ({ ...prev }));
  }, [setPagination]);

  const removeFilterKey = useCallback(
    (key, isAi) => {
      const f = { ...(pagination.filters || {}) };
      delete f[key];
      setPagination({
        ...pagination,
        filters: f,
        aiFilterKeys: isAi
          ? aiFilterKeys.filter((k) => k !== key)
          : aiFilterKeys,
        key: pageModule,
      });
    },
    [pagination, aiFilterKeys, pageModule, setPagination]
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

  const emptyDescription = useMemo(
    () =>
      helpers.notEmpty(pagination?.filters) || pagination?.search
        ? t.REMOVE_FILTER
        : t.NO_DATA,
    [pagination?.filters, pagination?.search, t]
  );

  const isEmpty = useMemo(
    () =>
      !pageDataQuery.isLoading &&
      !!pageData &&
      !dataQuery.isLoading &&
      !!indexData &&
      (!indexData.data || indexData.data.length === 0),
    [pageDataQuery.isLoading, pageData, dataQuery.isLoading, indexData]
  );

  const handlePaginationChange = useCallback(
    (current, pageSize) => {
      handleChangeTable(
        { current, pageSize },
        pagination?.filters || {},
        pagination?.sorter?.field
          ? {
              column: { fieldName: pagination.sorter.field },
              order: pagination.sorter.order,
            }
          : {}
      );
    },
    [handleChangeTable, pagination]
  );

  const listPagination = useMemo(
    () => ({
      current: pagination?.current ?? 1,
      pageSize: pagination?.pageSize ?? 15,
      pageSizeOptions: ["10", "15", "30", "50", "100", "500"],
      total: indexData?.total ?? 0,
      hideOnSinglePage: false,
      showSizeChanger: true,
      onChange: handlePaginationChange,
    }),
    [pagination, indexData?.total, handlePaginationChange]
  );

  const rows = indexData?.data ?? [];

  const loadErrorStatus = getLoadBlockedStatus(pageDataQuery, dataQuery);
  const notFound = loadErrorStatus != null;

  const headerLoading = pageDataQuery.isLoading && !pageData;
  const bodyLoading = dataQuery.isLoading && !indexData;

  return {
    form,
    t,
    pageModule,
    setUrlParams,
    pageData,
    pageDataQuery,
    indexData,
    dataQuery,
    columns,
    mergedColumns,
    pagination,
    setPagination,
    aiFilterKeys,
    aiQuery,
    aiMode,
    rows,
    isEmpty,
    emptyDescription,
    listPagination,
    notFound,
    loadErrorStatus,
    headerLoading,
    bodyLoading,
    handleChangeTable,
    onSearch,
    handleClearFilters,
    handleAiFilters,
    handleAiClear,
    handleAiModeChange,
    handleColumnChange,
    handlePaginationChange,
    removeFilterKey,
  };
}
