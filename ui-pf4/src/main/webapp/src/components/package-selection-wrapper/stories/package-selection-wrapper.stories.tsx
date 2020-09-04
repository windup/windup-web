import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  PackageSelectionWrapper,
  PackageSelectionWrapperProps,
} from "../package-selection-wrapper";

export default {
  title: "Components / PackageSelectionWrapper",
  component: PackageSelectionWrapper,
  argTypes: {
    onChange: { action: "onChange" },
  },
} as Meta;

const Template: Story<PackageSelectionWrapperProps> = (args) => (
  <PackageSelectionWrapper {...args} />
);
