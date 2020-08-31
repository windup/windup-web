import * as React from "react";
import { Checkbox } from "@patternfly/react-core";
import {
  Table,
  TableHeader,
  TableBody,
  ICell,
  IRow,
} from "@patternfly/react-table";
import { useSelectionState } from "./useSelectionState";

export const Checkboxes: React.FunctionComponent = () => {
  // import { Checkbox } from '@patternfly/react-core';

  interface IFruit {
    name: string;
    // Anything else, this can come straight from API data
  }

  const fruits: IFruit[] = [
    { name: "Apple" },
    { name: "Orange" },
    { name: "Banana" },
  ];

  const {
    selectedItems,
    isItemSelected,
    toggleItemSelected,
    areAllSelected,
    selectAll,
  } = useSelectionState<IFruit>({
    items: fruits,
    isEqual: (a, b) => a.name === b.name,
  });

  return (
    <div>
      <Checkbox
        id="select-all"
        label="Select all"
        isChecked={areAllSelected}
        onChange={(checked) => selectAll(checked)}
      />
      <br />
      {fruits.map((fruit) => (
        <Checkbox
          key={fruit.name}
          id={`${fruit.name}-checkbox`}
          label={fruit.name}
          isChecked={isItemSelected(fruit)}
          onChange={() => toggleItemSelected(fruit)}
        />
      ))}
      {selectedItems.length > 0 ? (
        <>
          <br />
          <p>
            Do something with these!{" "}
            {selectedItems.map((fruit) => fruit.name).join(", ")}
          </p>
        </>
      ) : null}
    </div>
  );
};

export const ExpandableTable: React.FunctionComponent = () => {
  // import { Table, TableHeader, TableBody, ICell, IRow } from '@patternfly/react-table';

  interface IFruit {
    name: string;
    price: string;
    description: string;
  }

  const fruits: IFruit[] = [
    { name: "Apple", price: "$0.83", description: "Red delicious!" },
    { name: "Orange", price: "$0.74", description: "Fresh and juicy!" },
    { name: "Banana", price: "$0.45", description: "On sale this week!" },
  ];

  const {
    isItemSelected: isItemExpanded,
    toggleItemSelected: toggleItemExpanded,
  } = useSelectionState<IFruit>({
    items: fruits,
    isEqual: (a, b) => a.name === b.name,
  });

  const columns: ICell[] = [{ title: "Name" }, { title: "Price" }];
  const rows: IRow[] = [];
  fruits.forEach((fruit) => {
    const isExpanded = isItemExpanded(fruit);
    rows.push({
      meta: { fruit },
      isOpen: isExpanded,
      cells: [fruit.name, fruit.price],
    });
    if (isExpanded) {
      rows.push({
        parent: rows.length - 1,
        fullWidth: true,
        cells: [fruit.description],
      });
    }
  });

  return (
    <Table
      variant="compact"
      aria-label="Fruits table"
      onCollapse={(_event, _rowIndex, _isOpen, rowData) =>
        toggleItemExpanded(rowData.meta.fruit)
      }
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
