import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  RulePathViewDetails,
  RulePathViewDetailsProps,
} from "../rulepath-view-details";

export default {
  title: "Components / RulePathViewDetails",
  component: RulePathViewDetails,
  argTypes: {},
} as Meta;

const Template: Story<RulePathViewDetailsProps> = (args) => (
  <RulePathViewDetails {...args} />
);

export const Basic = Template.bind({});
