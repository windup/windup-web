import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AddRuleLabelTabs, AddRuleLabelTabsProps } from "../add-rulelabel-tabs";

export default {
  title: "Forms / AddRuleLabelTabs",
  component: AddRuleLabelTabs,
  argTypes: {
    onCancelServerPath: { action: "onCancelServerPath" },
    onSubmitFinishedServerPath: { action: "onSubmitFinishedServerPath" },
  },
} as Meta;

const Template: Story<AddRuleLabelTabsProps> = (args) => (
  <AddRuleLabelTabs {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  projectId: 1,
  type: "Rule",
};

export const InitialValue = Template.bind({});
InitialValue.args = {
  projectId: 1,
};
