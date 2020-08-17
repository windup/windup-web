import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  ProjectDetailsForm,
  ProjectDetailsFormProps,
} from "../project-details-form";

export default {
  title: "Components / ProjectDetailsForm",
  component: ProjectDetailsForm,
  argTypes: {
    onSubmit: { action: "submit" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<ProjectDetailsFormProps> = (args) => (
  <ProjectDetailsForm {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  searchProjectByName: (value: string): Promise<any> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 1000);
    }),
};

export const InitialValue = Template.bind({});
InitialValue.args = {
  initialValues: {
    name: "my organization",
    description: "my description",
  },
  searchProjectByName: (value: string): Promise<any> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 1000);
    }),
};

export const HideFormControls = Template.bind({});
HideFormControls.args = {
  showFormControls: false,
  searchProjectByName: (value: string): Promise<any> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 1000);
    }),
};
