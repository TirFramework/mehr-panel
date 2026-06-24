import React, { useState } from "react";
import { Button, Popconfirm, Dropdown, App } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  FormOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEditing } from "../context/EditingContext";
import { useDeleteRow } from "../Request";
import useGetParams from "../hooks/useGetParams";
import Config, { defaultFilter } from "../constants/config";
import * as helpers from "../lib/helpers";
import { useLanguage } from "../context/LanguageContext";

export const DetailRow = ({ id }) => {
  const { pageModule } = useParams();
  const { editingId } = useEditing();
  const { t } = useLanguage();

  if (editingId === id) {
    return null;
  }

  return (
    <Link to={`/${Config.prefix}/${pageModule}/detail?id=${id}`}>
      <Button type="link" size="small">
        <EyeOutlined />
        <span className="action-text">{t.DETAIL}</span>
      </Button>
    </Link>
  );
};

export const EditRow = ({ id }) => {
  const { pageModule } = useParams();
  const { editingId } = useEditing();
  const { t } = useLanguage();

  if (editingId === id) {
    return null;
  }

  return (
    <Link to={`/${Config.prefix}/${pageModule}/create-edit?id=${id}`}>
      <Button type="link" size="small">
        <FormOutlined />
        <span className="action-text">{t.EDIT}</span>
      </Button>
    </Link>
  );
};

export const DeleteRow = ({ id, interactionCharacter }) => {
  const { pageModule } = useParams();
  const { editingId } = useEditing();
  const deleteRow = useDeleteRow();
  const { t } = useLanguage();

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
          // Invalidate and refetch the query to update the table
          queryClient.invalidateQueries({
            queryKey: [`index-data-${pageModule}`]
          });
        },
      }
    );
  };

  if (editingId === id) {
    return null;
  }

  return (
    <Popconfirm title={t.SURE_TO_DELETE} onConfirm={handleDelete}>
      <Button
        type="link"
        danger
        loading={deleteRow.isPending}
        size="small"
        icon={<DeleteOutlined />}
      >
        <span className="action-text">{t.DELETE}</span>
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
  const { t } = useLanguage();

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
          {t.SAVE}
        </Button>
        <Button type="link" onClick={cancelEditing}>
          {t.CANCEL}
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
      <span className="action-text">{t.INLINE_EDIT}</span>
    </Button>
  );
};

export const createActionsColumn = (configs, pageModule, form, t) => {
  const moduleActions = configs.actions;
  const interactionCharacter =
    configs.primary_key || Config.interactionCharacter;
  const showAction = moduleActions.show;
  const editAction = moduleActions.edit;
  const inlineEditAction = moduleActions.inlineEdit;
  const deleteAction = moduleActions.destroy;

  return {
    title: t.ACTIONS,
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

