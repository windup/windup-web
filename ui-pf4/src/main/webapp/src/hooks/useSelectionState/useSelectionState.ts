import * as React from "react";

export interface ISelectionStateArgs<T> {
  items: T[];
  initialSelected?: T[];
  isEqual?: (a: T, b: T) => boolean;
}

export interface ISelectionState<T> {
  selectedItems: T[];
  isItemSelected: (item: T) => boolean;
  toggleItemSelected: (item: T, isSelecting?: boolean) => void;
  areAllSelected: boolean;
  selectAll: (isSelecting?: boolean) => void;
  setSelectedItems: (items: T[]) => void;
}

export const useSelectionState = <T>({
  items,
  initialSelected = [],
  isEqual = (a, b) => a === b,
}: ISelectionStateArgs<T>): ISelectionState<T> => {
  const [selectedItems, setSelectedItems] = React.useState<T[]>(
    initialSelected
  );

  const isItemSelected = (item: T) =>
    selectedItems.some((i) => isEqual(item, i));

  const toggleItemSelected = (item: T, isSelecting = !isItemSelected(item)) => {
    if (isSelecting) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((i) => !isEqual(i, item)));
    }
  };

  const selectAll = (isSelecting = true) =>
    setSelectedItems(isSelecting ? items : []);
  const areAllSelected = selectedItems.length === items.length;

  // Preserve original order of items
  let selectedItemsInOrder: T[] = [];
  if (areAllSelected) {
    selectedItemsInOrder = items;
  } else if (selectedItems.length > 0) {
    selectedItemsInOrder = items.filter(isItemSelected);
  }

  return {
    selectedItems: selectedItemsInOrder,
    isItemSelected,
    toggleItemSelected,
    areAllSelected,
    selectAll,
    setSelectedItems,
  };
};
