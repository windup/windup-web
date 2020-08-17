import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { DeleteButton, DeleteButtonProps } from "../delete-button";

export default {
  title: "Components / DeleteButton",
  component: DeleteButton,
  argTypes: {
    onDelete: { action: "delete" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<DeleteButtonProps> = (args) => <DeleteButton {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  objType: "Project",
  objID: "My organization",
  messageMatch: "delete",
};

export const Disabled = Template.bind({});
Disabled.args = {
  objType: "Project",
  objID: "My organization",
  messageMatch: "delete",
  isDisabled: true,
};
