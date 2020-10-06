import React from "react";
import {
  Form,
  FormGroup,
  TextInput,
  TextArea,
  ActionGroup,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";

import { Formik } from "formik";
import * as yup from "yup";

import { getProjectIdByName } from "api/api";
import { MigrationProject } from "models/api";

import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";

export interface ProjectDetailsFormValue {
  name: string;
  description: string;
}

export interface ProjectDetailsFormProps {
  formRef?: any;
  project?: MigrationProject; // Initial values
  hideFormControls?: boolean;
  onSubmit?: (value: any) => void;
  onCancel?: () => void;
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  project,
  hideFormControls,
  formRef,
  onCancel,
  onSubmit,
}) => {
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required("This field is required.")
      .min(3, "The project name must contain at least 3 characters.")
      .max(120, "The project name must contain fewer than 120 characters.")
      .matches(
        /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/,
        "The project name must contain only alphanumeric characters."
      )
      .test("uniqueValue", "The entered name is already in use.", (value) => {
        return getProjectIdByName(value!)
          .then(({ data }) => {
            const isValid: boolean =
              data === "" ||
              data === undefined ||
              data === null ||
              project?.title === value;
            return isValid;
          })
          .catch(() => false);
      }),
    description: yup
      .string()
      .nullable()
      .trim()
      .max(4096, "The description must contain fewer than 4096 characters."),
  });

  return (
    <Formik
      innerRef={formRef}
      validateOnMount
      validationSchema={validationSchema}
      initialValues={{
        name: project?.title || "",
        description: project?.description || "",
      }}
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        isValidating,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => {
        const onChangeField = (_value: any, event: any) => {
          handleChange(event);
        };

        return (
          <Form onSubmit={handleSubmit}>
            <FormGroup
              label="Name"
              fieldId="name"
              helperText="A unique name for the project"
              isRequired={true}
              validated={getValidatedFromError(errors.name)}
              helperTextInvalid={errors.name}
            >
              <TextInput
                id="name"
                type="text"
                name="name"
                aria-describedby="name"
                isRequired={true}
                onChange={onChangeField}
                onBlur={handleBlur}
                value={values.name}
                validated={getValidatedFromErrorTouched(
                  errors.name,
                  touched.name
                )}
              />
            </FormGroup>
            <FormGroup
              label="Description"
              fieldId="description"
              helperText="short description of the project"
              isRequired={false}
              validated={getValidatedFromError(errors.description)}
              helperTextInvalid={errors.description}
            >
              <TextArea
                id="description"
                type="text"
                name="description"
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
            {!hideFormControls && (
              <ActionGroup>
                <Button
                  type="submit"
                  variant={ButtonVariant.primary}
                  isDisabled={!isValid || isSubmitting || isValidating}
                >
                  Save
                </Button>
                <Button variant={ButtonVariant.link} onClick={onCancel}>
                  Cancel
                </Button>
              </ActionGroup>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
