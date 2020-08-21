import React from "react";

import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/dist/cjs/form-template";
import componentMapper from "@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper";

import { AddApplications } from "./components/add-applications";

export enum AppComponentTypes {
  ADD_APPLICATIONS = "add-applications",
}

export const mapperExtension = {
  [AppComponentTypes.ADD_APPLICATIONS]: AddApplications,
};

const FormTemplateWrapper = (props: any) => (
  <FormTemplate {...props} showFormControls={false} />
);

const AppFormRenderer = (props: any) => (
  <FormRenderer
    componentMapper={{
      ...componentMapper,
      ...mapperExtension,
    }}
    FormTemplate={FormTemplateWrapper}
    {...props}
  />
);

export default AppFormRenderer;
