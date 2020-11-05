import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { PackageSelection, PackageSelectionProps } from "../package-selection";

export default {
  title: "Components / PackageSelection",
  component: PackageSelection,
  argTypes: {
    onSelectedPackagesChange: { action: "onSelectedPackagesChange" },
    onUndo: { action: "onUndo" },
  },
} as Meta;

const Template: Story<PackageSelectionProps> = (args) => (
  <PackageSelection {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  packages: [],
  selectedPackages: [],
};
