import React from "react";
import Export from "./Export";

/**
 * Shared pagination showTotal: export + total count.
 * Used by IndexTableBody and custom IndexBody views (e.g. cards).
 */
export default function IndexPaginationTotal({ index, total }) {
  const { t, dataQuery, indexData, columns, pagination } = index;

  return (
    <div className="page-index__pagination-footer">
      <Export
        loading={dataQuery.isLoading || dataQuery.isFetching}
        data={indexData?.data ?? []}
        columns={columns ?? []}
        pagination={pagination}
      />
      <span className="page-index__total">
        {t.TOTAL_COUNT.replace("{total}", total)}
      </span>
    </div>
  );
}
