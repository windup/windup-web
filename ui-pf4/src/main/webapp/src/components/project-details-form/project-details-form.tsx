import React from "react";
import { FormGroup, TextInput, TextArea } from "@patternfly/react-core";

import { FormikHandlers, FormikState } from "formik";

import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";

export interface ProjectDetailsFormValues {
  name: string;
  description: string;
}

export interface ProjectDetailsFormProps
  extends FormikState<ProjectDetailsFormValues>,
    FormikHandlers {}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
}) => {
  const onChangeField = (_value: any, event: any) => {
    handleChange(event);
  };

  return (
    <>
      <div className="pf-c-form">
        <FormGroup
          label="Name"
          fieldId="name"
          helperText="Unique project name."
          isRequired={true}
          validated={getValidatedFromError(errors.name)}
          helperTextInvalid={errors.name}
        >
          <TextInput
            type="text"
            name="name"
            aria-label="name"
            aria-describedby="name"
            isRequired={true}
            onChange={onChangeField}
            onBlur={handleBlur}
            value={values.name}
            validated={getValidatedFromErrorTouched(errors.name, touched.name)}
            autoComplete="off"
          />
        </FormGroup>
        <FormGroup
          label="Description"
          fieldId="description"
          helperText="Brief description of the project."
          isRequired={false}
          validated={getValidatedFromError(errors.description)}
          helperTextInvalid={errors.description}
        >
          <TextArea
            type="text"
            name="description"
            aria-label="description"
            aria-describedby="description"
            isRequired={false}
            onChange={onChangeField}
            onBlur={handleBlur}
            value={values.description}
            validated={getValidatedFromErrorTouched(
              errors.description,
              touched.description
            )}
          />
        </FormGroup>
      </div>
    </>
  );
};
