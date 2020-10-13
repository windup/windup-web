import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  DeleteProjectModal,
  DeleteProjectModalProps,
} from "../delete-project-modal";

export default {
  title: "Components / DeleteProjectModal",
  component: DeleteProjectModal,
  argTypes: {
    onDelete: { action: "delete" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<DeleteProjectModalProps> = (args) => (
  <DeleteProjectModal {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  projectTitle: "My organization",
  matchText: "delete",
  inProgress: false,
  isModalOpen: true,
};

export const InProgress = Template.bind({});
InProgress.args = {
  projectTitle: "My organization",
  matchText: "delete",
  inProgress: true,
  isModalOpen: true,
};
