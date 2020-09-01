import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  DualPackageSelection,
  DualPackageSelectionProps,
} from "../dual-package-selection";
import { ApiResponse } from "./application-packages-example";

export default {
  title: "Components / DualPackageSelection",
  component: DualPackageSelection,
  argTypes: {
    onChange: { action: "onChange" },
  },
} as Meta;

const Template: Story<DualPackageSelectionProps> = (args) => (
  <DualPackageSelection {...args} />
);

export const AdministracionEfectivo = Template.bind({});
AdministracionEfectivo.args = {
  packages: ApiResponse.packageTree,
  includedPackages: [],
  excludedPackages: [],
};
