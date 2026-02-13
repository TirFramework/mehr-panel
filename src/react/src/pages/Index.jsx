import React, { useMemo, useCallback } from "react";
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
} from "antd";
import * as helpers from "../lib/helpers";
import { useGetColumns, useGetData } from "../Request";
import Config, { defaultFilter } from "../constants/config";
import Search from "../blocks/Search";
import CustomCol from "../blocks/CustomCol";
import Export from "../blocks/Export";
import useGetParams from "../hooks/useGetParams";
import { useTableColumns } from "../hooks/useTableColumns";
import {
  getPlacementsForSearch,
  isCustomView,
} from "../lib/utils";
import { useLanguage } from "../context/LanguageContext";

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
      const orderBy = {
        field: sorter?.column?.fieldName,
        order: sorter.order,
      };

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
      key: pageModule,
    });
  }, [pageModule, setPagination]);

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

  // debugger;
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
                    <Search
                      loading={dataQuery.isLoading}
                      value={pagination?.search}
                      onSearch={onSearch}
                      placeholder={getPlacementsForSearch(pageData?.cols)}
                    />

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
              scroll={{ y: "calc(100vh - 340px)" }}
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
