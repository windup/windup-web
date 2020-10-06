import React, { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  IActions,
  ICell,
  IRow,
  ISortBy,
  SortByDirection,
  Table,
  TableHeader,
} from "@patternfly/react-table";

import {
  FilterToolbarItem,
  FetchTable,
  SimplePagination,
  ConditionalRender,
} from "components";

export interface TableSectionOfflineProps {
  toolbar?: any;
  emptyState?: any;

  columns: ICell[];
  actions?: IActions;

  isLoadingData: boolean;
  loadingVariant?: "skeleton" | "spinner" | "none";
  loadingDataError: any;

  items: any[];
  mapToIRow: (items: any[]) => IRow[];
  filterItem: (filterText: string, value: any) => boolean;
  compareItem: (a: any, b: any, columnIndex?: number) => number;
}

export const TableSectionOffline: React.FC<TableSectionOfflineProps> = ({
  items,
  columns,
  actions,
  toolbar,
  emptyState,
  isLoadingData,
  loadingVariant,
  loadingDataError,
  mapToIRow,
  filterItem,
  compareItem,
}) => {
  const [rows, setRows] = useState<IRow[]>();
  const [filteredItems, setFilteredItems] = useState<any[]>();

  const [filterText, setFilterText] = useState("");
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState<ISortBy>();

  useEffect(() => {
    //  Sort
    let sortedItems: any[];
    const columnSortIndex = sortBy?.index;
    const columnSortDirection = sortBy?.direction;

    sortedItems = [...items].sort((a, b) => compareItem(a, b, columnSortIndex));
    if (columnSortDirection === SortByDirection.desc) {
      sortedItems = sortedItems.reverse();
    }

    // Filter
    const newFilteredItems = sortedItems.filter((p) =>
      filterItem(filterText, p)
    );
    setFilteredItems(newFilteredItems);

    // Paginate
    const pageItems = newFilteredItems.slice(
      (paginationParams.page - 1) * paginationParams.perPage,
      paginationParams.page * paginationParams.perPage
    );

    // map items[] to IRow[]
    const newRows = mapToIRow(pageItems);
    setRows(newRows);
  }, [
    filterText,
    paginationParams,
    sortBy,
    items,
    compareItem,
    filterItem,
    mapToIRow,
  ]);

  const handlFilterTextChange = (filterText: string) => {
    const newParams = { page: 1, perPage: paginationParams.perPage };

    setFilterText(filterText);
    setPaginationParams(newParams);
  };

  const handlePaginationChange = ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => {
    setPaginationParams({ page, perPage });
  };

  const handleOnSortChange = (sortBy: ISortBy) => {
    setSortBy(sortBy);
  };

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <FilterToolbarItem
            searchValue={filterText}
            onFilterChange={handlFilterTextChange}
            placeholder="Filter by name"
          />
          {toolbar}
          <ToolbarItem
            variant={ToolbarItemVariant.pagination}
            alignment={{ default: "alignRight" }}
          >
            <SimplePagination
              count={filteredItems ? filteredItems.length : 0}
              params={paginationParams}
              onChange={handlePaginationChange}
              isTop={true}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <ConditionalRender
        when={items.length === 0 && !isLoadingData && !loadingDataError}
        then={
          <>
            <Table aria-label="Table" cells={columns}>
              <TableHeader />
            </Table>
            <Card>
              <CardBody>{emptyState}</CardBody>
            </Card>
          </>
        }
      >
        <FetchTable
          rows={rows}
          columns={columns}
          actions={actions}
          fetchStatus={isLoadingData ? "inProgress" : "complete"}
          fetchError={loadingDataError}
          loadingVariant={loadingVariant}
          onSortChange={handleOnSortChange}
        />
      </ConditionalRender>
      <SimplePagination
        count={filteredItems ? filteredItems.length : 0}
        params={paginationParams}
        onChange={handlePaginationChange}
      />
    </>
  );
};
