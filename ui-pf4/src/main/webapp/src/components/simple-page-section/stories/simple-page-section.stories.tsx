import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  SimplePageSection,
  SimplePageSectionProps,
} from "../simple-page-section";

export default {
  title: "Components / SimplePageSection",
  component: SimplePageSection,
} as Meta;

const Template: Story<SimplePageSectionProps> = (args) => (
  <SimplePageSection {...args} />
);

export const OnlyTitle = Template.bind({});
OnlyTitle.args = {
  title: "my title",
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  title: "my title",
  description: "my description",
};
