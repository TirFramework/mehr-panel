import React from "react";
import { Space } from "antd";
import useIndexPage from "../hooks/useIndexPage";
import IndexShell from "../blocks/IndexShell";
import IndexCardsBody from "../blocks/IndexCardsBody";
import {
  useIndexCardsFilters,
  useIndexCardsSort,
} from "../blocks/IndexCardsFilters";
import NotFoundPage from "./NotFoundPage";

/**
 * List view — same data/filters/sort as Index, but cards instead of table.
 * Route: /:panel/:pageModule/list
 *
 * Override: dynamic-pages/{module}/list.jsx
 */
function List() {
  const index = useIndexPage();
  const { button: filterButton, panel } = useIndexCardsFilters(index);
  const { control: sortControl } = useIndexCardsSort(index);

  if (index.notFound) {
    return <NotFoundPage />;
  }

  const afterSearch =
    filterButton || sortControl ? (
      <Space wrap>
        {sortControl}
        {filterButton}
      </Space>
    ) : null;

  return (
    <IndexShell
      index={index}
      className="page-list"
      afterSearch={afterSearch}
      belowToolbar={panel}
      hideCustomCol
    >
      <IndexCardsBody index={index} />
    </IndexShell>
  );
}

export default List;
