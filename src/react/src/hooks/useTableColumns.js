import React, { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { createActionsColumn } from "../components/TableActions";
import { useLanguage } from "../context/LanguageContext";

/**
 * Hook to manage table columns with filtering and showAllSwitch support
 */
export const useTableColumns = (pageData, pagination, form) => {
  const { pageModule } = useParams();
  const [urlParams] = useSearchParams();
  const { t } = useLanguage();

  return useMemo(() => {
    if (
      !pageData?.cols?.length ||
      !pagination ||
      Object.keys(pagination).length === 0
    ) {
      return [];
    }

    // Handle URL column params (custom view)
    if (urlParams.get("columns")) {
      const columns = urlParams.get("columns").split(",");
      const filteredCols = pageData.cols
        .filter((col) => columns.includes(col.fieldName))
        .map((col) => ({
          ...col,
          filteredValue: pagination.filters?.[col.fieldName] || null,
          sortOrder:
            pagination?.sorter?.field === col.fieldName
              ? pagination?.sorter.order
              : null,
        }));
      filteredCols.push(createActionsColumn(pageData.configs, pageModule, form, t));
      return filteredCols;
    }

    // Map columns with filters and sorters
    const newData = pageData.cols.map((col) => ({
      ...col,
      filteredValue: pagination.filters?.[col.fieldName] || null,
      sortOrder:
        pagination?.sorter?.field === col.fieldName
          ? pagination?.sorter.order
          : null,
    }));

    // Check if showAllSwitch is enabled
    let showAllSwitch = false;
    try {
      const stored = window.localStorage.getItem(`cols-showAll-${pageModule}`);
      if (stored !== null) {
        showAllSwitch = JSON.parse(stored);
      }
    } catch (e) {
      showAllSwitch = false;
    }

    // If showAllSwitch is enabled, return all columns
    if (showAllSwitch) {
      newData.push(createActionsColumn(pageData.configs, pageModule, form, t));
      return newData;
    }

    // Filter by active columns from localStorage
    try {
      const storedCols = window.localStorage.getItem(`cols-${pageModule}`);
      if (storedCols) {
        const activeCols = JSON.parse(storedCols);
        // Handle both array and object formats
        const activeColsArray = Array.isArray(activeCols)
          ? activeCols
          : Object.values(activeCols);

        if (activeColsArray && activeColsArray.length > 0) {
          const filteredList = newData.filter((item) =>
            activeColsArray.includes(item.field.display)
          );
          filteredList.push(
            createActionsColumn(pageData.configs, pageModule, form, t)
          );
          return filteredList;
        }
      }
    } catch (e) {
      // Fall through to default behavior
    }

    // Default: return all columns
    newData.push(createActionsColumn(pageData.configs, pageModule, form, t));
    return newData;
  }, [pageData, pagination, pageModule, form, urlParams, t]);
};
