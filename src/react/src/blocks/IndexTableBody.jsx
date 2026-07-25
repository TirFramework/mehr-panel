import React from "react";
import { Card, Table, Skeleton, Spin, Empty, Pagination } from "antd";
import IndexPaginationTotal from "./IndexPaginationTotal";

/**
 * Default Index body: Ant Design Table + shared pagination/export.
 */
function IndexTableBody({ index }) {
  const {
    mergedColumns,
    rows,
    isEmpty,
    emptyDescription,
    listPagination,
    bodyLoading,
    headerLoading,
    handleChangeTable,
  } = index;

  const tablePagination = {
    ...listPagination,
    showTotal: (total) => <IndexPaginationTotal index={index} total={total} />,
  };

  return (
    <Card
      className={`index-page__card${isEmpty ? " index-page__card--empty" : ""}`}
    >
      {headerLoading ? (
        <div className="table-loading">
          <div className="table-loading__header">
            <Skeleton.Input
              active={true}
              size="large"
              style={{ width: "100%", height: "55px" }}
            />
          </div>
          <div className="table-loading__body">
            <Spin />
          </div>
          <div className="table-loading__footer">
            <Skeleton.Input
              active={true}
              size="large"
              style={{ width: "100px", height: "32px" }}
            />
            <Skeleton.Input
              active={true}
              size="large"
              style={{ width: "400px", height: "32px" }}
            />
          </div>
        </div>
      ) : (
        <>
          {isEmpty && (
            <div className="table-empty-state">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyDescription}
              />
            </div>
          )}
          <Table
            tableLayout="auto"
            scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
            columns={mergedColumns}
            rowKey={(record) => record.id || record._id}
            dataSource={rows}
            locale={{
              emptyText: (
                <div className="table-empty-placeholder" aria-hidden="true" />
              ),
            }}
            pagination={isEmpty ? false : tablePagination}
            loading={bodyLoading}
            onChange={handleChangeTable}
          />
          {isEmpty && (
            <div className="index-page__table-footer ant-table-pagination">
              <Pagination {...tablePagination} />
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default IndexTableBody;
