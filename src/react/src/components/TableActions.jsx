import React, { useState } from "react";
import { Button, Popconfirm, Dropdown, App } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  FormOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEditing } from "../context/EditingContext";
import { useDeleteRow } from "../Request";
import useGetParams from "../hooks/useGetParams";
import Config, { defaultFilter } from "../constants/config";
import * as helpers from "../lib/helpers";

export const DetailRow = ({ id }) => {
  const { pageModule } = useParams();
  const navigate = useNavigate();
  const { editingId } = useEditing();

  const handleClick = () => {
    navigate(`/${Config.perfix}/${pageModule}/detail?id=${id}`);
  };

  if (editingId === id) {
    return null;
  }

  return (
    <Button type="link" size="small" onClick={handleClick}>
      <EyeOutlined />
      <span className="action-text">Detail</span>
    </Button>
  );
};

export const EditRow = ({ id }) => {
  const { pageModule } = useParams();
  const navigate = useNavigate();
  const { editingId } = useEditing();

  const handleClick = () => {
    navigate(`/${Config.perfix}/${pageModule}/create-edit?id=${id}`);
  };

  if (editingId === id) {
    return null;
  }

  return (
    <Button type="link" onClick={handleClick} size="small">
      <FormOutlined />
      <span className="action-text">Edit</span>
    </Button>
  );
};

export const DeleteRow = ({ id, interactionCharacter }) => {
  const { pageModule } = useParams();
  const { editingId } = useEditing();
  const deleteRow = useDeleteRow();

  const [pagination] = useGetParams(pageModule, {
    ...defaultFilter,
    key: pageModule,
  });
  const queryClient = useQueryClient();

  const handleDelete = () => {
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
  };

  if (editingId === id) {
    return null;
  }

  return (
    <Popconfirm title="Sure to delete?" onConfirm={handleDelete}>
      <Button
        type="link"
        danger
        loading={deleteRow.isLoading}
        size="small"
        icon={<DeleteOutlined />}
      >
        <span className="action-text">Delete</span>
      </Button>
    </Popconfirm>
  );
};

export const InlineEdit = ({ id, form, data }) => {
  const { editingId, startEditing, cancelEditing } = useEditing();
  const [saveLoading, setSaveLoading] = useState(false);
  const { pageModule } = useParams();
  const [pagination] = useGetParams(pageModule, {
    ...defaultFilter,
    key: pageModule,
  });
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        helpers.onFinish({
          message: message,
          values: values,
          setSubmitLoad: setSaveLoading,
          pageModule: pageModule,
          pageId: editingId,
          afterSubmit: () => {
            cancelEditing();
          },
          requestBy: "inlineEdit",
          queryClient: queryClient,
          queryClientKey: [`index-data-${pageModule}`, pagination],
        });
      })
      .catch((errorInfo) => {});
  };

  const handleStartEdit = () => {
    form.setFieldsValue({
      ...data,
    });
    startEditing(id);
  };

  if (editingId === id) {
    return (
      <>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleFormSubmit}
          loading={saveLoading}
          style={{ width: "85px" }}
        >
          Save
        </Button>
        <Button type="link" onClick={cancelEditing}>
          Cancel
        </Button>
      </>
    );
  }

  return (
    <Button
      onClick={handleStartEdit}
      type="link"
      size="small"
      icon={<EditOutlined />}
    >
      <span className="action-text">Inline Edit</span>
    </Button>
  );
};

export const createActionsColumn = (configs, pageModule, form) => {
  const moduleActions = configs.actions;
  const interactionCharacter =
    configs.primary_key || Config.interactionCharacter;
  const showAction = moduleActions.show;
  const editAction = moduleActions.edit;
  const inlineEditAction = moduleActions.inlineEdit;
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
          <div className="action-td action-td--desktop">
            {showAction && <DetailRow id={id} />}
            {inlineEditAction && (
              <InlineEdit id={id} form={form} data={data} />
            )}
            {editAction && <EditRow id={id} />}
            {deleteAction && (
              <DeleteRow id={id} interactionCharacter={interactionCharacter} />
            )}
          </div>
          <div className="action-td action-td--mobile">
            <Dropdown
              menu={{
                items: [
                  showAction && {
                    key: "detail",
                    label: <DetailRow id={id} />,
                  },
                  inlineEditAction && {
                    key: "inlineEdit",
                    label: <InlineEdit id={id} form={form} data={data} />,
                  },
                  editAction && {
                    key: "edit",
                    label: <EditRow id={id} />,
                  },
                  deleteAction && {
                    key: "delete",
                    label: (
                      <DeleteRow
                        id={id}
                        interactionCharacter={interactionCharacter}
                      />
                    ),
                  },
                ].filter(Boolean),
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button type="link" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </>
      );
    },
  };
};

