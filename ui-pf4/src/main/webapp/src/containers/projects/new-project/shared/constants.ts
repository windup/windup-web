import { Field } from "@data-driven-forms/react-form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";

export const TITLE = "Create project";
export const DESCRIPTION = "Create a project for your applications";

export const newProjectWizardField: Field = {
  name: "new-project-wizard",
  component: componentTypes.WIZARD,
  title: TITLE,
  description: DESCRIPTION,
  inModal: true,
  buttonLabels: {
    submit: "Next",
  },
  fields: [],
};
