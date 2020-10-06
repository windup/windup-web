import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { PackageDualList, PackageDualListProps } from "../package-dual-list";

// Examples
import { ApiResponse } from "./examples/administracionEfectivo";
var manyPackages = require("./examples/manyPackages.json");

export default {
  title: "Components / PackageDualList",
  component: PackageDualList,
  argTypes: {
    onChange: { action: "onChange" },
  },
} as Meta;

const Template: Story<PackageDualListProps> = (args) => (
  <PackageDualList {...args} />
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
