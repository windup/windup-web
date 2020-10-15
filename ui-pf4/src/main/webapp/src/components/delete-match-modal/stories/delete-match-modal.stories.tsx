import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { DeleteMatchModal, DeleteMatchModalProps } from "../delete-match-modal";

export default {
  title: "Components / DeleteMatchModal",
  component: DeleteMatchModal,
  argTypes: {
    onDelete: { action: "delete" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<DeleteMatchModalProps> = (args) => (
  <DeleteMatchModal {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  isModalOpen: true,
  title: "Delete project",
  message: "Are you sure you want to delete the project 'ABC'",
  matchText: "ABC",
  inProgress: false,
};

export const InProgress = Template.bind({});
InProgress.args = {
  ...Basic.args,
  inProgress: true,
};
