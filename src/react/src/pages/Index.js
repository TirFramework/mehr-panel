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
  CheckboxGroup,
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
} from "@ant-design/icons";
import { CSVLink } from "react-csv";

import * as helpers from "../lib/helpers";

import * as api from "../api";
import useLocalStorage from "../hooks/useLocalStorage";
import { useGetColumns, useGetData } from "../Request";
import { defaultFIlter } from "../constants/config";
import { useQueryClient } from "react-query";
import Search from "../blocks/Search";

const { Title } = Typography;

function Index() {
  const { pageModule } = useParams();
  const [pagination, setPagination] = useLocalStorage(pageModule);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [column, setColumn] = useState([]);

  const { data: pageData, ...pageDataQuery } = useGetColumns(
    pageModule,
    pagination,
    {
      onSuccess: (res) => {
        //   console.log("🚀 ~ file: Index.js:136 ~ Index ~ res:", res);
        res.cols.forEach(() => {
          const newData = [...res.cols];
          newData.forEach((col) => {
            col.filteredValue = pagination.filters[col.fieldName] || null;
          });
          setColumn(newData);
        });
      },
    }
  );
  const { data: indexData, ...dataQuery } = useGetData(
    pagination?.key || pageModule,
    pagination,
    {
      onSuccess: (res) => {
        //   console.log("🚀 ~ file: Index.js:136 ~ Index ~ res:", res);
      },
      enabled: !!pagination?.key,
    }
  );

  // useEffect(() => {
  //   // Your code using the updated pagination value
  //   console.log("🚀 ~ file: Index.js:74 ~ Index ~ pagination:", pagination);
  // }, [pagination]);

  // console.log("🚀 ~ file: Index.js:68 ~ Index ~ indexData:", indexData);

  // debugger;

  const handleChangeColumns = (activeCols) => {
    // setTableLoading(true);
    // setActiveColumn(activeCols);
    // getData(pagination);
    // getColumns(pagination);
    // console.log("activeCols", activeCols);
    // console.log("columnList", columnList);
    // console.log("columnList", activeCols);
    // setTableLoading(false);
  };

  const handleChangeTable = (p, filters, sorter) => {
    filters = helpers.removeNullFromObject(filters);
    // const orderBy = {
    //   field: sorter?.column?.fieldName,
    //   order: sorter.order,
    // };

    setPagination({
      ...pagination,
      current: p.current,
      pageSize: p.pageSize,
      filters: filters,
      // sorter: orderBy,
    });
    setColumn((prevColumns) => {
      return prevColumns.map((col) => ({
        ...col,
        filteredValue: filters[col.fieldName] || null,
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
      .catch((errorInfo) => {
        // console.log(
        //   "🚀 ~ file: Index.js:299 ~ handleFormSubmit ~ errorInfo:",
        //   errorInfo
        // );
      });
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
        <Title>{pageData?.configs?.module_title}</Title>
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
          <Row align="bottom" className="mb-4" justify={"space-between"}>
            <Col className="gutter-row">
              <Space>
                <>
                  <Search
                    loading={dataQuery.isLoading}
                    value={pagination.search}
                    onSearch={onSearch}
                  />
                  {/* <Button
                    type="primary"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    Open Modal
                  </Button> */}
                </>
                <>
                  {(helpers.notEmpty(pagination?.filters) ||
                    pagination.search) && (
                    <Button
                      icon={<ClearOutlined />}
                      type="primary"
                      size="large"
                      danger
                      onClick={() => {
                        setPagination(defaultFIlter);
                        const newData = [...column];
                        newData.forEach((col) => {
                          col.filteredValue = null;
                        });
                        setColumn(newData);
                      }}
                    />
                  )}
                </>
                {/* <>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    placeholder="Please select"
                    // defaultValue={['a10', 'c12']}
                    onChange={handleChangeColumns}
                    options={column}
                  />
                </> */}
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
                          handleFormSubmit();
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
            scroll={{ y: "calc(100vh - 400px)" }}
            columns={column}
            rowKey={(record) => record.id || record._id}
            dataSource={indexData?.data}
            pagination={{
              pageSize: pagination?.pageSize,
              current: pagination?.current,
              pageSizeOptions: ["15", "30", "50", "100", "500"],
              total: indexData?.total,
              showTotal: (total) => <Button>Total: {indexData?.total}</Button>,
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
            footer={() => (
              <>
                {!dataQuery.isLoading && indexData?.data && (
                  <CSVLink
                    filename={"Expense_Table.csv"}
                    data={indexData?.data}
                    className="btn btn-primary"
                  >
                    Export to CSV
                  </CSVLink>
                )}
              </>
            )}
          />
        </Card>
      </Form>

      {/* <Modal title="Basic Modal" open={isModalOpen}>
        <>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            Check all
          </Checkbox>
          <Divider />
          <CheckboxGroup
            options={column.map((item) => {
              console.log(
                "🚀 ~ file: Index.js:319 ~ options={column.map ~ item:",
                item
              );
            })}
            // value={checkedList}
            onChange={() => {}}
          />
        </>
      </Modal> */}
    </div>
  );
}

export default Index;
