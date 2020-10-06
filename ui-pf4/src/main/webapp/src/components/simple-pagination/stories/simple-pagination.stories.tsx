import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { SimplePagination, SimplePaginationProps } from "../simple-pagination";

export default {
  title: "Components / SimplePagination",
  component: SimplePagination,
  args: {
    params: {},
  },
  argTypes: {
    onChange: { action: "changed" },
  },
} as Meta;

const Template: Story<SimplePaginationProps> = (args) => (
  <SimplePagination {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  count: 100,
};

export const Compact = Template.bind({});
Compact.args = {
  count: 100,
  isCompact: true,
};

export const PerPageOptions = Template.bind({});
PerPageOptions.args = {
  count: 100,
  perPageOptions: [12, 24],
};

export const IsTop = Template.bind({});
IsTop.args = {
  count: 100,
  isTop: true,
};
