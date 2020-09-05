import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  ProjectDetailsFormDDF,
  ProjectDetailsFormDDFProps,
} from "../project-details-form-ddf";

export default {
  title: "Forms / ProjectDetailsFormDDF",
  component: ProjectDetailsFormDDF,
  argTypes: {
    onSubmit: { action: "submit" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<ProjectDetailsFormDDFProps> = (args) => (
  <ProjectDetailsFormDDF {...args} />
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
