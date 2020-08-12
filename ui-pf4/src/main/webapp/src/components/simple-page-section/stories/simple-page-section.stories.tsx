import * as React from "react";
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

export const Basic = Template.bind({});
Basic.args = {
  title: "my title",
};
