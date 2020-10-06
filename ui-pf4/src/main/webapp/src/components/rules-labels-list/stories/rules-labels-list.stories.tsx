import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { RulesLabelsList, RulesListProps } from "../rules-labels-list";

export default {
  title: "Components / RulesLabelsList",
  component: RulesLabelsList,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<RulesListProps> = (args) => <RulesLabelsList {...args} />;

export const Basic = Template.bind({});
