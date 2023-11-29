import { Button, Popover, Tag } from "antd";
import dayjs from "dayjs";
import {
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useParams, Link, useHistory } from "react-router-dom";
import { useDeleteRow } from "../Request";
import useLocalStorage from "../hooks/useLocalStorage";
import { useQueryClient } from "react-query";

export const getColsNormalize = (res, params, pageModule) => {
  console.log("🚀 ~ file: utils.js:2 ~ getColsNormalize ~ filter:", params);
  let cols = res.cols;

  //   // loop for detect array
  cols.forEach((col) => {
    console.log("🚀 ~ file: utils.js:75 ~ cols.forEach ~ col:", col);

    // var item;

    // ----------------------------------------
    // set default filter
    if (params?.filters?.hasOwnProperty(col.dataIndex)) {
      const item = params?.filters[col.dataIndex];
      col.defaultFilteredValue = item;
    }
    // ----------------------------------------

    // ----------------------------------------
    // convert to array
    col.dataIndex = col.dataIndex.split(".");
    // ----------------------------------------

    // ----------------------------------------
    // handle date
    if (col.type === "DatePicker") {
      col.render = (value) => {
        if (value) {
          return dayjs(value).format(
            !col.field.options?.showTime?.length
              ? col.field.options.dateFormat
              : col.field.options.dateFormat + " " + col.field.options?.showTime
          );
        }
      };
    }
    // ----------------------------------------

    // ----------------------------------------
    // handle array
    if (col.valueType === "array") {
      col.render = (arr) =>
        arr?.map((item, index) => <Tag key={index}>{item}</Tag>);
    } else if (col.valueType === "object") {
      col.render = (arr) => arr?.text;
    }
    // ----------------------------------------

    // -----------------------------------
    // add data for filter
    if (col.filters !== undefined) {
      col.filters?.map((item) => (item.text = item.label));
      col.filterSearch = col.filters.length > 10;
    }
    // -----------------------------------

    if (col.dataSet.length !== 0) {
      col.render = (data) => {
        if (typeof data === "object" && data) {
          return (
            <>
              {data.map(function (item, index) {
                if (col.dataKey) {
                  item = item[col.dataKey];
                }
                return <Tag key={index}>{col.dataSet[item]}</Tag>;
              })}
            </>
          );
        } else {
          return <>{col.dataSet[data]}</>;
        }
      };
    }

    if (col.comment?.content !== undefined) {
      col.title = (
        <div>
          {col.title}
          <Popover content={col.comment.content} title={col.comment.title}>
            <QuestionCircleOutlined />
          </Popover>
        </div>
      );
    }
    // col.sorter = col.field.sortable;
    // if (activeColumn.length > 0) {
    //   if (!activeColumn.includes(col.fieldName)) {
    //     col.className = "hidden";
    //   }
    // }
  });
  cols.push(actions(res.configs.actions, pageModule));
  return res;

  //   return {
  //     actions: {
  //       index: true,
  //       create: false,
  //       show: true,
  //       edit: true,
  //       destroy: false,
  //       fullDestroy: false,
  //     },
  //     configs: {
  //       actions: {
  //         index: true,
  //         create: false,
  //         show: true,
  //         edit: true,
  //         destroy: false,
  //         fullDestroy: false,
  //       },
  //       module_title: "Cost",
  //     },
  //     cols: [
  //       {
  //         title: "First Name",
  //         dataIndex: "first_name",
  //         fieldName: "first_name",
  //         valueType: "string",
  //         comment: [],
  //         dataSet: [],
  //         dataKey: null,
  //         type: "Text",
  //         field: {
  //           type: "Text",
  //           originalName: "first_name",
  //           name: "first_name",
  //           request: "first_name",
  //           page: "index",
  //           valueType: "string",
  //           display: "First Name",
  //           placeholder: "",
  //           class: "",
  //           group: "all",
  //           col: 24,
  //           disable: false,
  //           readonly: false,
  //           showOnIndex: true,
  //           showOnDetail: false,
  //           showOnCreating: false,
  //           showOnEditing: false,
  //           sortable: true,
  //           searchable: true,
  //           rules: [],
  //           creationRules: [],
  //           updateRules: [],
  //           options: [],
  //           data: [],
  //           filter: [],
  //           filterable: false,
  //           multiple: false,
  //           comment: [],
  //           dataSet: [],
  //           additional: false,
  //           fillable: true,
  //           className: "first_name",
  //         },
  //       },
  //       {
  //         title: "Last Name",
  //         dataIndex: "last_name",
  //         fieldName: "last_name",
  //         valueType: "string",
  //         comment: [],
  //         dataSet: [],
  //         dataKey: null,
  //         type: "Text",
  //         field: {
  //           type: "Text",
  //           originalName: "last_name",
  //           name: "last_name",
  //           request: "last_name",
  //           page: "index",
  //           valueType: "string",
  //           display: "Last Name",
  //           placeholder: "",
  //           class: "",
  //           group: "all",
  //           col: 24,
  //           disable: false,
  //           readonly: false,
  //           showOnIndex: true,
  //           showOnDetail: false,
  //           showOnCreating: false,
  //           showOnEditing: false,
  //           sortable: true,
  //           searchable: true,
  //           rules: [],
  //           creationRules: [],
  //           updateRules: [],
  //           options: [],
  //           data: [],
  //           filter: [],
  //           filterable: false,
  //           multiple: false,
  //           comment: [],
  //           dataSet: [],
  //           additional: false,
  //           fillable: true,
  //           className: "last_name",
  //         },
  //       },
  //       {
  //         title: "Status",
  //         dataIndex: ["costs", "status"],
  //         fieldName: "costs.status",
  //         valueType: "string",
  //         comment: [],
  //         dataSet: {
  //           wait: "Waiting",
  //           process: "In Progress",
  //           finish: "Completed",
  //           rejected: "Rejected",
  //           approved: "Approved",
  //           paid: "Paid",
  //         },
  //         dataKey: null,
  //         type: "CustomDocStatus",
  //         field: {
  //           type: "CustomDocStatus",
  //           originalName: "costs.status",
  //           name: "costs.status",
  //           request: "costs.status",
  //           valueType: "string",
  //           display: "Status",
  //           placeholder: "",
  //           class: "",
  //           group: "all",
  //           col: 18,
  //           disable: false,
  //           readonly: false,
  //           showOnIndex: true,
  //           showOnDetail: true,
  //           showOnCreating: true,
  //           showOnEditing: true,
  //           sortable: true,
  //           searchable: false,
  //           rules: [],
  //           creationRules: [],
  //           updateRules: [],
  //           options: [],
  //           data: [
  //             {
  //               value: "wait",
  //               label: "Waiting",
  //             },
  //             {
  //               value: "process",
  //               label: "In Progress",
  //             },
  //             {
  //               value: "finish",
  //               label: "Completed",
  //             },
  //             {
  //               value: "rejected",
  //               label: "Rejected",
  //             },
  //             {
  //               value: "approved",
  //               label: "Approved",
  //             },
  //             {
  //               value: "paid",
  //               label: "Paid",
  //             },
  //           ],
  //           filter: [
  //             {
  //               value: "wait",
  //               label: "Waiting",
  //             },
  //             {
  //               value: "process",
  //               label: "In Progress",
  //             },
  //             {
  //               value: "finish",
  //               label: "Completed",
  //             },
  //             {
  //               value: "rejected",
  //               label: "Rejected",
  //             },
  //             {
  //               value: "approved",
  //               label: "Approved",
  //             },
  //             {
  //               value: "paid",
  //               label: "Paid",
  //             },
  //           ],
  //           filterable: true,
  //           multiple: false,
  //           comment: [],
  //           dataSet: {
  //             wait: "Waiting",
  //             process: "In Progress",
  //             finish: "Completed",
  //             rejected: "Rejected",
  //             approved: "Approved",
  //             paid: "Paid",
  //           },
  //           additional: false,
  //           fillable: true,
  //           className: "costs-status",
  //         },
  //         filters: [
  //           {
  //             value: "wait",
  //             text: "Waiting",
  //           },
  //           {
  //             value: "process",
  //             text: "In Progress",
  //           },
  //           {
  //             value: "finish",
  //             text: "Completed",
  //           },
  //           {
  //             value: "rejected",
  //             text: "Rejected",
  //           },
  //           {
  //             value: "approved",
  //             text: "Approved",
  //           },
  //           {
  //             value: "paid",
  //             text: "Paid",
  //           },
  //         ],
  //       },
  //     ],
  //     dataRoute: "http://crm-beta-qa-dev2023.monarchco.de/api/v1/admin/cost/data",
  //     trashRoute:
  //       "http://crm-beta-qa-dev2023.monarchco.de/api/v1/admin/cost/trashData",
  //   };
};

const actions = (moduleActions, pageModule) => {
  const showAction = moduleActions.show;
  const editAction = moduleActions.edit;
  const deleteAction = moduleActions.destroy;
  return {
    title: "",
    dataIndex: "id",
    align: "right",
    fixed: "right",
    width: 200,
    render: (id, data) => {
      return (
        <>
          {showAction && (
            <Link
              to={`/admin/${pageModule}/detail?id=${data.id || data._id}`}
              className="ant-btn ant-btn-link ant-btn-icon-only ml-4 showBtn"
              style={{ color: "#00921c" }}
            >
              <EyeOutlined title="Edit" />
            </Link>
          )}

          {editAction && (
            <Link
              to={`/admin/${pageModule}/create-edit?id=${data.id || data._id}`}
              className="ant-btn ant-btn-link ant-btn-icon-only ml-4 editBtn"
            >
              <EditOutlined title="Edit" />
            </Link>
          )}
          {deleteAction && <DeleteRow id={data.id || data._id} />}
        </>
      );
    },
  };
};

const DeleteRow = ({ id }) => {
  const { pageModule } = useParams();
  useDeleteRow(pageModule, id);

  const deleteRow = useDeleteRow();

  const [pagination, setPagination] = useLocalStorage(pageModule);
  const queryClient = useQueryClient();

  return (
    <Button
      className={"ml-4"}
      type="link"
      danger
      loading={deleteRow.isLoading}
      onClick={() => {
        deleteRow.mutate(
          { pageModule, id },
          {
            onSuccess: () => {
              queryClient.setQueryData(
                [`index-data-${pageModule}`, pagination],
                (oldData) => {
                  const newData = oldData.data.filter(
                    (item) => item._id !== id
                  );
                  return { ...oldData, data: newData };
                }
              );
            },
          }
        );
      }}
      icon={<DeleteOutlined />}
    />
  );
  // setTableLoading(true);
  // api
  //   .deleteRow(pageModule, id)
  //   .then((res) => {
  //     // console.log("🚀 ~ file: Create.js ~ line 77 ~ .then ~ res", res)
  //     notification["success"]({
  //       message: res.message,
  //     });
  //     //TODO:: pagination problem after delete the item
  //     setTableLoading(false);
  //     getData(pagination);
  //   })
  //   .catch((err) => {
  //     // console.log("🚀 ~ file: Create.js ~ line 88 ~ onFinish ~ err", err);
  //     setTableLoading(false);
  //   });
};

export const indexOfInObject = (arr, obj, val) => {
  let result = -1;
  arr.forEach((element, index) => {
    if (element[obj] === val) {
      result = index;
    }
  });
  return result;
};
