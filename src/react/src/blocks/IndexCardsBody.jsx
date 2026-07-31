import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Spin,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  FormOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";
import { useDeleteRow } from "../Request";
import IndexPaginationTotal from "./IndexPaginationTotal";
import {
  resolveFieldClassName,
  resolveLabelType,
} from "../lib/fieldLabel";
import { resolveFieldColProps } from "../lib/helpers/fieldCol";

const { Text } = Typography;

function cellText(row, col) {
  const key = col.dataIndex ?? col.fieldName;
  const value =
    key != null
      ? Array.isArray(key)
        ? key.reduce((acc, k) => (acc == null ? acc : acc[k]), row)
        : row[key]
      : undefined;

  if (typeof col.render === "function") {
    try {
      const rendered = col.render(value, row, 0);
      if (typeof rendered === "string" || typeof rendered === "number") {
        return rendered;
      }
      if (rendered != null && typeof rendered === "object") {
        return rendered;
      }
    } catch {
      /* fall through */
    }
  }
  if (value == null || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function columnLabel(col) {
  if (typeof col.title === "string") return col.title;
  return col.title?.props?.title ?? col.fieldName ?? col.dataIndex;
}

function fieldColProps(col) {
  return resolveFieldColProps(col?.field?.col ?? col?.col, {
    from: "md",
    defaultFull: true,
  });
}

function IndexCardItem({ row, columns, configs, pageModule, t }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteRow = useDeleteRow();

  const interactionCharacter =
    configs?.primary_key || Config.interactionCharacter;
  const id = row[interactionCharacter] ?? row.id ?? row._id;

  const showEdit = !!configs?.actions?.edit;
  const showDelete = !!configs?.actions?.destroy;
  const showDetail = !!configs?.actions?.show;

  const menuItems = [
    showEdit && {
      key: "edit",
      icon: <FormOutlined />,
      label: t.EDIT,
      onClick: () =>
        navigate(`/${Config.prefix}/${pageModule}/create-edit?id=${id}`),
    },
    showDelete && {
      key: "delete",
      danger: true,
      icon: <DeleteOutlined />,
      label: t.DELETE,
      onClick: () => {
        Modal.confirm({
          title: t.SURE_TO_DELETE,
          okType: "danger",
          okText: t.DELETE,
          cancelText: t.CLOSE,
          onOk: () =>
            deleteRow.mutateAsync(
              { pageModule, id },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: [`index-data-${pageModule}`],
                  });
                },
              }
            ),
        });
      },
    },
  ].filter(Boolean);

  const fields = columns
    .filter((col) => col.dataIndex || col.fieldName)
    .filter((col) => {
      const di = col.dataIndex;
      if (di === interactionCharacter) return false;
      if (
        Array.isArray(di) &&
        di.length === 1 &&
        di[0] === interactionCharacter
      ) {
        return false;
      }
      return true;
    });

  return (
    <Card
      size="small"
      className="index-page__row-card"
      styles={{ body: { display: "flex", flexDirection: "column", gap: 12 } }}
      extra={
        menuItems.length > 0 ? (
          <Dropdown
            menu={{
              items: menuItems,
              className: "index-card-actions-menu",
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        ) : null
      }
    >
      <Row gutter={[16, 12]} style={{ flex: 1 }}>
        {fields.map((col) => {
          const field = col.field;
          const fieldOptions = field?.options;
          const labelMode = resolveLabelType({
            labelType: field?.labelType,
            options: fieldOptions,
          });
          const fieldClassName = resolveFieldClassName({
            className: field?.className,
            class: field?.class,
            options: fieldOptions,
          });
          const label = columnLabel(col);
          const value = cellText(row, col);

          return (
            <Col
              key={col.key || col.fieldName || String(col.dataIndex)}
              {...fieldColProps(col)}
              className={fieldClassName}
            >
              {labelMode === "hidden" ? (
                <div className="index-card-field__value">{value}</div>
              ) : labelMode === "inline" ? (
                <div className="index-card-field index-card-field--inline">
                  <Text
                    type="secondary"
                    className="index-card-field__label"
                    style={{ fontSize: 13 }}
                  >
                    {label}:
                  </Text>
                  <div className="index-card-field__value">{value}</div>
                </div>
              ) : (
                <>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {label}
                  </Text>
                  <div className="index-card-field__value">{value}</div>
                </>
              )}
            </Col>
          );
        })}
      </Row>

      {showDetail && (
        <div className="index-card-actions" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to={`/${Config.prefix}/${pageModule}/detail?id=${id}`}>
            <Button type="primary" size="small">
              {t.DETAIL}
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}


/**
 * Index body as cards — uses field.col for field width inside the card.
 * See docs/FIELD_COL.md (span, auto, fill, full, CSS size, responsive object).
 */
function IndexCardsBody({ index }) {
  const { t } = useLanguage();
  const {
    rows,
    columns,
    pageData,
    pageModule,
    isEmpty,
    emptyDescription,
    listPagination,
    bodyLoading,
    headerLoading,
  } = index;

  const displayColumns = useMemo(
    () =>
      columns.filter(
        (col) =>
          (col.dataIndex || col.fieldName) &&
          col.title !== t.ACTIONS &&
          !col.fixed
      ),
    [columns, t.ACTIONS]
  );

  const rowPrimaryKey =
    pageData?.configs?.primary_key || Config.interactionCharacter;

  const pagination = {
    ...listPagination,
    showTotal: (total) => <IndexPaginationTotal index={index} total={total} />,
  };

  if (headerLoading) {
    return (
      <div className="table-loading">
        <Spin />
      </div>
    );
  }

  return (
    <div className="index-page__cards">
      {bodyLoading && !rows.length ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : isEmpty ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyDescription}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {rows.map((row) => (
            <Col key={row[rowPrimaryKey] ?? row.id ?? row._id} span={24}>
              <IndexCardItem
                row={row}
                columns={displayColumns}
                configs={pageData?.configs}
                pageModule={pageModule}
                t={t}
              />
            </Col>
          ))}
        </Row>
      )}

      <div
        className="index-page__table-footer ant-table-pagination"
        style={{ marginTop: 16 }}
      >
        <Pagination {...pagination} />
      </div>
    </div>
  );
}

export default IndexCardsBody;
