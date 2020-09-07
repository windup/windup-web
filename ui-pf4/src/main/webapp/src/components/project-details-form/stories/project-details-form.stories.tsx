import * as React from "react";
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

export const Basic = Template.bind({});
Basic.args = {};

export const InitialValue = Template.bind({});
InitialValue.args = {
  isInitialValuesValid: true,
  initialValues: {
    name: "my organization",
    description: "my description",
  },
};

export const HideFormControls = Template.bind({});
HideFormControls.args = {
  hideFormControls: true,
};
