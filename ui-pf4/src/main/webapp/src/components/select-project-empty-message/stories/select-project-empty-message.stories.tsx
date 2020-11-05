import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  SelectProjectEmptyMessage,
  SelectProjectEmptyMessageProps,
} from "../select-project-empty-message";

export default {
  title: "Components / SelectProjectEmptyMessage",
  component: SelectProjectEmptyMessage,
  argTypes: {},
} as Meta;

const Template: Story<SelectProjectEmptyMessageProps> = (args) => (
  <SelectProjectEmptyMessage {...args} />
);

export const Basic = Template.bind({});
