import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { PackageSelection, PackageSelectionProps } from "../package-selection";

// Examples
import { ApiResponse } from "./examples/administracionEfectivo";
var manyPackages = require("./examples/manyPackages.json");

export default {
  title: "Components / PackageSelection",
  component: PackageSelection,
  argTypes: {
    onChange: { action: "onChange" },
  },
} as Meta;

const Template: Story<PackageSelectionProps> = (args) => (
  <PackageSelection {...args} />
);

export const AdministracionEfectivo = Template.bind({});
AdministracionEfectivo.args = {
  packages: ApiResponse.packageTree,
  includedPackages: [],
};

export const ManyPackages = Template.bind({});
ManyPackages.args = {
  packages: manyPackages.packageTree,
  includedPackages: [],
};
