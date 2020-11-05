import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { RulelabelTitle, RulelabelTitleProps } from "../rule-label-title";

export default {
  title: "Components / RulelabelTitle",
  component: RulelabelTitle,
  argTypes: {},
} as Meta;

const Template: Story<RulelabelTitleProps> = (args) => (
  <RulelabelTitle {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  name: "My rule/label",
  errors: [],
};

export const Empty = Template.bind({});
Empty.args = {
  ...Basic.args,
  numberOfRulesLabels: 0,
};

export const Error = Template.bind({});
Error.args = {
  ...Basic.args,
  errors: ["Error1", "Error2"],
};
