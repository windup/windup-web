import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  FilterToolbarItem,
  FilterToolbarItemProps,
} from "../filter-toolbar-item";

export default {
  title: "Components / FilterToolbarItem",
  component: FilterToolbarItem,
  argTypes: {},
  args: {},
} as Meta;

const Template: Story<FilterToolbarItemProps> = (args) => (
  <FilterToolbarItem {...args} />
);

export const InProgressSpinner = Template.bind({});
InProgressSpinner.args = {
  onFilterChange: (val: string) => {},
  placeholder: "Filter by field",
};
