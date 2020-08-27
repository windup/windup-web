import React from "react";

import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/dist/cjs/form-template";
import componentMapper from "@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper";

import { AddApplications } from "./components/add-applications";
import { SelectTransformationPath } from "./components/select-transformation-path";

export enum AppComponentTypes {
  ADD_APPLICATIONS = "add-applications",
  SELECT_TRANSFORMATION_PATH = "select-transformation-path",
}

export const mapperExtension = {
  [AppComponentTypes.ADD_APPLICATIONS]: AddApplications,
  [AppComponentTypes.SELECT_TRANSFORMATION_PATH]: SelectTransformationPath,
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
    // debug={(a) => console.log(a)}
    {...props}
  />
);

export default AppFormRenderer;
