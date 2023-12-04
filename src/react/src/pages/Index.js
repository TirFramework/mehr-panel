import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { PlusOutlined, ClearOutlined, EyeOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Row,
  Table,
  Input,
  Tag,
  Form,
  Typography,
  Modal,
  Col,
  Select,
  Skeleton,
  Space,
  Checkbox,
  Divider,
} from "antd";

import {
  EditOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";

import * as helpers from "../lib/helpers";

import * as api from "../api";
import useLocalStorage from "../hooks/useLocalStorage";
import { useGetColumns, useGetData } from "../Request";
import { defaultFIlter } from "../constants/config";
import { useQueryClient } from "react-query";
import Search from "../blocks/Search";
import CustomCol from "../blocks/CustomCol";
import Export from "../blocks/Export";

const { Title } = Typography;

function Index() {
  const { pageModule } = useParams();
  const [pagination, setPagination] = useLocalStorage(pageModule, {
    ...defaultFIlter,
    key: pageModule,
  });

  const [column, setColumn] = useState([]);

  const { data: pageData, ...pageDataQuery } = useGetColumns(
    pageModule,
    pagination,
    {
      onSuccess: (res) => {
        setColumn((prevCols) => {
          const newData = res.cols.map((col) => {
            return {
              ...col,
              filteredValue: pagination.filters[col.fieldName] || null,
              defaultSortOrder:
                pagination.sorter?.field === col.fieldName
                  ? pagination.sorter.order
                  : null,
            };
          });
          const activeCols = JSON.parse(
            window.localStorage.getItem(`cols-${pageModule}`)
          );

          if (activeCols) {
            const filteredList = newData.filter((item) =>
              activeCols.includes(item.title)
            );
            return filteredList;
          }
          return newData;
        });
      },
    }
  );
  const { data: indexData, ...dataQuery } = useGetData(
    pagination?.key || pageModule,
    pagination,
    {
      enabled: !!pagination?.key,
    }
  );

  const handleChangeTable = (p, filters, sorter) => {
    console.log("🚀 ~ file: Index.js:93 ~ handleChangeTable ~ sorter:", sorter);
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
    setColumn((prevColumns) => {
      return prevColumns.map((col) => ({
        ...col,
        filteredValue: filters[col.fieldName] || null,
        sortOrder:
          sorter?.column?.fieldName === col.fieldName ? sorter.order : null,
      }));
    });
  };

  const onSearch = (value) => {
    if (value === "") {
      value = null;
    }
    setPagination({
      ...pagination,
      search: value,
      current: 1,
      key: pageModule,
    });
  };

  const [urlParams, setUrlParams] = useSearchParams();

  let pageId = urlParams.get("id");

  const [form] = Form.useForm();

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setUrlParams("");
      })
      .catch((errorInfo) => {});
  };

  return (
    <div className={`${pageModule}-index page-index`}>
      <Form
        form={form}
        component={false}
        onFinish={(value) => {
          // console.log("🚀 ~ file: Index.js:295 ~ EditableRow ~ value:", value);
        }}
        onFinishFailed={(value) => {
          // console.log("🚀 ~ file: Index.js:315 ~ EditableRow ~ value:", value);
        }}
        // disabled={!(pageId === restProps["data-row-key"])}
      >
        <Title className="page-index__title">
          {pageData?.configs?.module_title}
        </Title>
        {pageDataQuery.isLoading ? (
          <>
            <Skeleton.Input
              active={true}
              size="large"
              className="w-full"
              style={{ width: "200px", height: "40px", marginBottom: "16px" }}
            />
            <Skeleton.Input
              active={true}
              size="large"
              className="w-full"
              style={{ width: "100%", height: "40px", marginBottom: "16px" }}
            />
          </>
        ) : (
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
                  />

                  <CustomCol
                    column={pageData?.cols}
                    onChange={(newCol) => {
                      setColumn(newCol);
                    }}
                  />
                </>
                <>
                  {(helpers.notEmpty(pagination?.filters) ||
                    pagination.search ||
                    helpers.notEmpty(pagination?.sorter)) && (
                    <Button
                      icon={<ClearOutlined />}
                      type="primary"
                      size="large"
                      danger
                      onClick={() => {
                        setPagination({ ...defaultFIlter, key: pageModule });
                        const newData = [...column];
                        newData.forEach((col) => {
                          col.filteredValue = null;
                          col.sortOrder = {};
                        });
                        setColumn(newData);
                      }}
                    />
                  )}
                </>
              </Space>
            </Col>
            <Col className="gutter-row text-right">
              <Space>
                <>
                  {pageId && (
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        onClick={() => {
                          // handleFormSubmit();
                          alert("comig soon!");
                        }}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  )}
                </>
                {pageData?.actions?.create && (
                  <Link to={`/admin/${pageModule}/create-edit`}>
                    <Button
                      size="large"
                      type="primary"
                      icon={<PlusOutlined />}
                      loading={pageDataQuery.isLoading}
                    >
                      {pageData?.configs?.module_title}
                    </Button>
                  </Link>
                )}
              </Space>
            </Col>
          </Row>
        )}
        <Card loading={pageDataQuery.isLoading} className="index-page__card">
          <Table
            scroll={{ y: "calc(100vh - 340px)" }}
            columns={column}
            rowKey={(record) => record.id || record._id}
            dataSource={indexData?.data}
            noDataContent={
              helpers.notEmpty(pagination?.filters) || pagination?.search
                ? "remove filter "
                : "nodata"
            }
            pagination={{
              pageSize: pagination?.pageSize,
              current: pagination?.current,
              pageSizeOptions: ["15", "30", "50", "100", "500"],
              total: indexData?.total,
              showTotal: (total) => (
                <>
                  <Row justify={"space-between"}>
                    <Col>
                      <Export
                        loading={dataQuery.isLoading || dataQuery.isFetching}
                        data={indexData?.data}
                      />
                    </Col>
                    <Col>
                      <Button>Total: {indexData?.total}</Button>
                    </Col>
                  </Row>
                </>
              ),
            }}
            // components={{
            //   body: {
            //     row: ({ children, ...restProps }) => {
            //       return <EditableRow children={children} {...restProps} />;
            //     },
            //   },
            // }}

            // components={{
            //   body: {
            //     cell: EditableCell,
            //   },
            // }}
            loading={dataQuery.isLoading || dataQuery.isFetching}
            onChange={handleChangeTable}
            // footer={() => (
            //   <>
            //     {!dataQuery.isLoading && indexData?.data && (
            //       <CSVLink
            //         filename={"Expense_Table.csv"}
            //         data={indexData?.data}
            //         className="btn btn-primary"
            //       >
            //         Export to CSV
            //       </CSVLink>
            //     )}
            //   </>
            // )}
          />
        </Card>
      </Form>
    </div>
  );
}

export default Index;
