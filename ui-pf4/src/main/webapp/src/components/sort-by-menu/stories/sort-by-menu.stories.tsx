import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { SortByMenu, SortByMenuProps } from "../sort-by-menu";

export default {
  title: "Components / SortByMenu",
  component: SortByMenu,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
  args: {
    options: ["Option1", "Option2", "Option3"],
  },
} as Meta;

const Template: Story<SortByMenuProps> = (args) => <SortByMenu {...args} />;

export const Basic = Template.bind({});
