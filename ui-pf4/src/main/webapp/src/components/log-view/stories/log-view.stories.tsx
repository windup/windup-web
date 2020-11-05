import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { LogView, LogViewProps } from "../log-view";

export default {
  title: "Components / LogView",
  component: LogView,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<LogViewProps> = (args) => <LogView {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  headerText: "This is the header",
  lines: ["line1", "line2", "line3"],
  isStreamActive: true,
};
