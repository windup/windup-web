import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Welcome, WelcomeProps } from "../welcome";

export default {
  title: "Components / Welcome",
  component: Welcome,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<WelcomeProps> = (args) => <Welcome {...args} />;

export const Basic = Template.bind({});
