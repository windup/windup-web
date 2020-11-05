import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Formik } from "formik";
import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
} from "@patternfly/react-core";

import {
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
} from "../schema";
import {
  ProjectDetailsForm,
  ProjectDetailsFormProps,
} from "../project-details-form";

export default {
  title: "Forms / ProjectDetailsForm",
  component: ProjectDetailsForm,
  argTypes: {},
} as Meta;

const BasicTemplate: Story<ProjectDetailsFormProps> = (args) => (
  <Formik
    initialValues={projectDetailsFormInitialValue()}
    validationSchema={projectDetailsFormSchema()}
    onSubmit={() => {}}
    initialErrors={{ name: "" }}
  >
    {({ isValid, handleSubmit, ...formik }) => {
      return (
        <Form onSubmit={handleSubmit}>
          <ProjectDetailsForm {...args} {...{ ...formik, handleSubmit }} />
          <ActionGroup>
            <Button
              type="submit"
              variant={ButtonVariant.primary}
              isDisabled={!isValid}
            >
              Save
            </Button>
            <Button variant={ButtonVariant.link}>Cancel</Button>
          </ActionGroup>
        </Form>
      );
    }}
  </Formik>
);

export const Basic = BasicTemplate.bind({});
Basic.args = {};

//

const project = {
  id: 1,
  title: "title",
  description: "description",
  provisional: false,
  created: 1599551047711,
  lastModified: 1599551108682,
  applications: [],
  defaultAnalysisContextId: 3803,
};

const InitialValueTemplate: Story<ProjectDetailsFormProps> = (args) => (
  <Formik
    initialValues={projectDetailsFormInitialValue(project)}
    validationSchema={projectDetailsFormSchema(project)}
    onSubmit={() => {}}
  >
    {({ isValid, handleSubmit, ...formik }) => {
      return (
        <Form onSubmit={handleSubmit}>
          <ProjectDetailsForm {...args} {...{ ...formik, handleSubmit }} />
          <ActionGroup>
            <Button
              type="submit"
              variant={ButtonVariant.primary}
              isDisabled={!isValid}
            >
              Save
            </Button>
            <Button variant={ButtonVariant.link}>Cancel</Button>
          </ActionGroup>
        </Form>
      );
    }}
  </Formik>
);

export const InitialValue = InitialValueTemplate.bind({});
InitialValueTemplate.args = {};
