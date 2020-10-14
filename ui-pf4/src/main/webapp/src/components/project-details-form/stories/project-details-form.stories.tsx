import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  ProjectDetailsForm,
  ProjectDetailsFormProps,
} from "../project-details-form";

export default {
  title: "Forms / ProjectDetailsForm",
  component: ProjectDetailsForm,
  argTypes: {
    onChange: { action: "change" },
    onSubmit: { action: "submit" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<ProjectDetailsFormProps> = (args) => (
  <ProjectDetailsForm {...args} />
);

// export const Basic = Template.bind({});
// Basic.args = {};

// export const InitialValue = Template.bind({});
// InitialValue.args = {
//   project: {
//     id: 3802,
//     title: "title",
//     description: "description",
//     provisional: false,
//     created: new Date(1599551047711),
//     lastModified: new Date(1599551108682),
//     applications: [],
//     defaultAnalysisContextId: 3803,
//   },
// };

// export const HideFormControls = Template.bind({});
// HideFormControls.args = {
//   hideFormControls: true,
// };
