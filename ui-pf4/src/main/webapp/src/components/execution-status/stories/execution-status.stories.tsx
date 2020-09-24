import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ExecutionStatus, ExecutionStatusProps } from "../execution-status";

export default {
  title: "Components / ExecutionStatus",
  component: ExecutionStatus,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<ExecutionStatusProps> = (args) => (
  <ExecutionStatus {...args} />
);

export const Queued = Template.bind({});
Queued.args = {
  state: "QUEUED",
};

export const Started = Template.bind({});
Started.args = {
  state: "STARTED",
};

export const Cancelled = Template.bind({});
Cancelled.args = {
  state: "CANCELLED",
};

export const Completed = Template.bind({});
Completed.args = {
  state: "COMPLETED",
};

export const Failed = Template.bind({});
Failed.args = {
  state: "FAILED",
};
