import React from "react";
import { useState } from "react";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
  EmptyStateBody,
  Button,
  Bullseye,
  Spinner,
  Skeleton,
} from "@patternfly/react-core";
import {
  Table,
  TableHeader,
  TableBody,
  ICell,
  IRow,
  IActions,
  SortByDirection,
  ISortBy,
  IActionsResolver,
  IAreActionsDisabled,
} from "@patternfly/react-table";
import { SearchIcon } from "@patternfly/react-icons";

import { FetchErrorEmptyState } from "components";

import { FetchStatus } from "store/common";
import { Constants } from "Constants";

export interface FetchTableProps {
  columns: ICell[];
  rows?: IRow[];
  actions?: IActions;
  actionResolver?: IActionsResolver;
  areActionsDisabled?: IAreActionsDisabled;
  fetchStatus: FetchStatus;
  loadingVariant?: "skeleton" | "spinner" | "none";
  fetchError?: any;
  onClearFilters?: () => void;
  onSortChange?: (sortBy: ISortBy) => void;
}

export const FetchTable: React.FC<FetchTableProps> = ({
  columns,
  rows,
  actions,
  actionResolver,
  areActionsDisabled,
  fetchStatus,
  fetchError,
  loadingVariant = "skeleton",
  onClearFilters,
  onSortChange,
}) => {
  const [tableSortBy, setTableSortBy] = useState<ISortBy>({});

  if (fetchError) {
    const rows: IRow[] = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: columns.length },
            title: <FetchErrorEmptyState />,
          },
        ],
      },
    ];

    return (
      <Table aria-label="Table - error" cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    );
  }

  if (fetchStatus !== "complete" && loadingVariant !== "none") {
    let rows: IRow[] = [];
    if (loadingVariant === "skeleton") {
      rows = [...Array(Constants.DEFAULT_PAGE_SIZE)].map(() => {
        return {
          cells: [...Array(columns.length)].map(() => ({
            title: <Skeleton />,
          })),
        };
      });
    } else if (loadingVariant === "spinner") {
      rows = [
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 8 },
              title: (
                <Bullseye>
                  <Spinner size="xl" />
                </Bullseye>
              ),
            },
          ],
        },
      ];
    }

    return (
      <Table aria-label="Table - loading" cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    );
  }

  if (rows && rows.length === 0) {
    const rows: IRow[] = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: columns.length },
            title: (
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                  No results found
                </Title>
                <EmptyStateBody>
                  No results match the filter criteria. Remove all filters or
                  clear all filters to show results.
                </EmptyStateBody>
                {onClearFilters && (
                  <Button variant="link" onClick={onClearFilters}>
                    Clear all filters
                  </Button>
                )}
              </EmptyState>
            ),
          },
        ],
      },
    ];

    return (
      <Table aria-label="Table - empty" cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    );
  }

  const onSort = (
    _: React.MouseEvent,
    index: number,
    direction: SortByDirection
  ) => {
    const newSortBy = { index, direction };

    setTableSortBy(newSortBy);
    if (onSortChange) {
      onSortChange(newSortBy);
    }
  };

  return (
    <>
      <Table
        aria-label="Table"
        cells={columns}
        rows={rows}
        actions={actions}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
        sortBy={tableSortBy}
        onSort={onSort}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </>
  );
};
