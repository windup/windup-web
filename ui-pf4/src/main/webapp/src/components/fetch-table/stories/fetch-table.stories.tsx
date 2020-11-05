import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";
import { FetchTable, FetchTableProps } from "../fetch-table";
import { IRow, ICell, IActions, sortable } from "@patternfly/react-table";

const columns: ICell[] = [
  { title: "Col1" },
  { title: "Col2" },
  { title: "Col3" },
];
const rows: IRow[] = [...Array(15)].map((_, rowIndex) => {
  return {
    cells: [...Array(columns.length)].map((_, colIndex) => ({
      title: `${rowIndex},${colIndex}`,
    })),
  };
});
const actions: IActions = [
  {
    title: "Action1",
    onClick: action("Action1"),
  },
  {
    title: "Action2",
    onClick: action("Action2"),
  },
];

export default {
  title: "Components / FetchTable",
  component: FetchTable,
  argTypes: {
    onClearFilters: { action: "clicked" },
    onSortChange: { action: "sortChanged" },
  },
  args: {
    columns,
    rows,
    actions,
  },
} as Meta;

const Template: Story<FetchTableProps> = (args) => <FetchTable {...args} />;

export const InProgressSpinner = Template.bind({});
InProgressSpinner.args = {
  fetchStatus: "inProgress",
  loadingVariant: "spinner",
};

export const InProgressSkeleton = Template.bind({});
InProgressSkeleton.args = {
  fetchStatus: "inProgress",
  loadingVariant: "skeleton",
};

export const InProgressNone = Template.bind({});
InProgressNone.args = {
  fetchStatus: "inProgress",
  loadingVariant: "none",
};

export const Error = Template.bind({});
Error.args = {
  fetchStatus: "complete",
  fetchError: "Error message",
  loadingVariant: "spinner",
};

export const Basic = Template.bind({});
Basic.args = {
  fetchStatus: "complete",
  loadingVariant: "spinner",
};

export const Empty = Template.bind({});
Empty.args = {
  rows: [],
  fetchStatus: "complete",
  loadingVariant: "spinner",
};

export const SortBy = Template.bind({});
SortBy.args = {
  columns: columns.map((col: ICell) => ({ ...col, transforms: [sortable] })),
  fetchStatus: "complete",
  loadingVariant: "spinner",
};
