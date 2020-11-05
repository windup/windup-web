import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ExpandableCard, ExpandableCardProps } from "../expandable-card";

export default {
  title: "Components / ExpandableCard",
  component: ExpandableCard,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<ExpandableCardProps> = (args) => (
  <ExpandableCard {...args}>body</ExpandableCard>
);

export const Basic = Template.bind({});
Basic.args = {
  title: "My title",
};
