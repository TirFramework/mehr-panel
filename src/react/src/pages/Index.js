import React, { useState } from "react";
import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
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
  Popconfirm,
  App,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  FormOutlined,
} from "@ant-design/icons";
import * as helpers from "../lib/helpers";

import useLocalStorage from "../hooks/useLocalStorage";
import { useDeleteRow, useGetColumns, useGetData } from "../Request";
import Config, { defaultFilter } from "../constants/config";
import Search from "../blocks/Search";
import CustomCol from "../blocks/CustomCol";
import Export from "../blocks/Export";
import { useQueryClient } from "react-query";

const { Title } = Typography;

function Index() {
  const [form] = Form.useForm();

  const { pageModule } = useParams();
  const [urlParams, setUrlParams] = useSearchParams();
  const pageId = urlParams.get("id");

  const [pagination, setPagination] = useLocalStorage(pageModule, {
    ...defaultFilter,
    key: pageModule,
  });

  const [column, setColumn] = useState([]);
  const isEditing = (record) => record.key === pageId;

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
              activeCols.includes(item.field.display)
            );
            filteredList.push(actions(res.configs, pageModule, form));
            return filteredList;
          }
          newData.push(actions(res.configs, pageModule, form));

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
    // console.log(
    //   "🚀 ~ file: Index.js:93 ~ handleChangeTable ~ filters:",
    //   filters
    // );
    // console.log("🚀 ~ file: Index.js:93 ~ handleChangeTable ~ sorter:", sorter);
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

  const mergedColumns = column.map((col) => {
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

  return (
    <div className={`${pageModule}-index page-index`}>
      <Form
        form={form}
        // disabled={!(pageId === restProps["data-row-key"])}
      >
        {pageDataQuery.isLoading ? (
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
              {pageData?.configs?.module_title}
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
                    />

                    {pageData?.cols.length && (
                      <CustomCol
                        column={[...pageData?.cols]}
                        onChange={(newCol) => {
                          setColumn([
                            ...newCol,
                            actions(pageData?.configs, pageModule, form),
                          ]);
                        }}
                      />
                    )}
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
                          setPagination({ ...defaultFilter, key: pageModule });
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
          </>
        )}
        <Card className="index-page__card">
          {pageDataQuery.isLoading ? (
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
                        />
                      </Col>
                      <Col>
                        <Button>Total: {indexData?.total}</Button>
                      </Col>
                    </Row>
                  </>
                ),
              }}
              loading={dataQuery.isLoading || dataQuery.isFetching}
              onChange={handleChangeTable}
            />
          )}
        </Card>
      </Form>
    </div>
  );
}

export default Index;

const actions = (configs, pageModule, form) => {
  const moduleActions = configs.actions;
  const interactionCharacter =
    configs.primary_key || Config.interactionCharacter;
  const showAction = moduleActions.show;
  const editAction = moduleActions.edit;
  const deleteAction = moduleActions.destroy;
  return {
    title: "Actions",
    dataIndex: interactionCharacter,
    align: "center",
    fixed: "right",
    width: 120,
    render: (id, data) => {
      return (
        <>
          <div className="action-td">
            {showAction && <DetailRow id={id} />}

            {/* {editAction && <InlineEdit id={id} form={form} data={data} />} */}

            {editAction && <EditRow id={id} />}

            {deleteAction && (
              <DeleteRow id={id} interactionCharacter={interactionCharacter} />
            )}
          </div>
        </>
      );
    },
  };
};

const DetailRow = ({ id }) => {
  const { pageModule } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  return (
    <>
      {pageId == id ? (
        <></>
      ) : (
        <Link
          type="link"
          // disabled={!!pageId}
          to={`/admin/${pageModule}/detail?id=${id}`}
        >
          <EyeOutlined />
        </Link>
      )}
    </>
  );
};
const EditRow = ({ id }) => {
  const { pageModule } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  return (
    <>
      {pageId == id ? (
        <></>
      ) : (
        <Link to={`/admin/${pageModule}/create-edit?id=${id}`}>
          <FormOutlined />
        </Link>
      )}
    </>
  );
};
const DeleteRow = ({ id, interactionCharacter }) => {
  const { pageModule } = useParams();
  useDeleteRow(pageModule, id);

  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  const deleteRow = useDeleteRow();

  const [pagination, setPagination] = useLocalStorage(pageModule, {
    ...defaultFilter,
    key: pageModule,
  });
  const queryClient = useQueryClient();

  return (
    <>
      {pageId == id ? (
        <></>
      ) : (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => {
            deleteRow.mutate(
              { pageModule, id },
              {
                onSuccess: () => {
                  queryClient.setQueryData(
                    [`index-data-${pageModule}`, pagination],
                    (oldData) => {
                      const basic = { ...oldData };
                      const newData = oldData.data.filter(
                        (item) => item[interactionCharacter] !== id
                      );
                      basic.total = oldData.total - 1;
                      return { ...basic, data: newData };
                    }
                  );
                },
              }
            );
          }}
        >
          <Button
            type="link"
            danger
            loading={deleteRow.isLoading}
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      )}
    </>
  );
};
const InlineEdit = ({ id, form, data }) => {
  const [urlParams, setUrlParams] = useSearchParams();
  let pageId = urlParams.get("id");
  const [saveLoading, setSaveLoading] = useState(false);
  const { pageModule } = useParams();
  const [pagination, setPagination] = useLocalStorage(pageModule, {
    ...defaultFilter,
    key: pageModule,
  });
  const queryClient = useQueryClient();
  const { message, notification, modal } = App.useApp();

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // setUrlParams("");
        helpers.onFinish({
          message: message,
          values: values,
          setSubmitLoad: setSaveLoading,
          pageModule: pageModule,
          pageId: pageId,
          setUrlParams: () => {},
          afterSubmit: () => {
            setUrlParams("");
            queryClient.setQueryData(
              [`index-data-${pageModule}`, pagination],
              (oldData) => {
                const newData = { ...oldData };

                newData.data.forEach((item) => {
                  if (item.id === Number(pageId)) {
                    for (const [key, value] of Object.entries(values)) {
                      item[key] = value;
                    }
                  }
                });
                console.log(
                  "🚀 ~ file: Index.js:508 ~ .then ~ newData:",
                  newData
                );

                return newData;
              }
            );
          },
        });
      })
      .catch((errorInfo) => {});
  };
  return (
    <>
      {pageId == id ? (
        <>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              handleFormSubmit();
            }}
            loading={saveLoading}
            style={{ width: "85px" }}

            // icon={<CloseOutlined />}
          >
            Save
          </Button>
          <Button
            type="link"
            onClick={() => {
              setUrlParams(``);
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              form.setFieldsValue({
                ...data,
              });
              setUrlParams(`id=${id}`);
            }}
            type="link"
            icon={<EditOutlined />}
          />
        </>
      )}
    </>
  );
};
