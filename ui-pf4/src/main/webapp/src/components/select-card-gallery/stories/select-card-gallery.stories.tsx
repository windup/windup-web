import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";
import {
  SelectCardGallery,
  SelectCardGalleryProps,
} from "../select-card-gallery";

export default {
  title: "Components / SelectCardGallery",
  component: SelectCardGallery,
  argTypes: { onChange: { action: "change" } },
} as Meta;

const Template: Story<SelectCardGalleryProps> = (args) => (
  <SelectCardGallery {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  value: [],
};

export const InitialValues = Template.bind({});
InitialValues.args = {
  value: ["linux", "camel"],
};

export const InitialValuesOnMultiple = Template.bind({});
InitialValuesOnMultiple.args = {
  value: ["eap7", "linux"],
};
