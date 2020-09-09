import * as React from "react";
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  ButtonVariant,
  Checkbox,
} from "@patternfly/react-core";

import { Formik } from "formik";
import * as yup from "yup";

import { pathExists } from "api/api";

import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";

const validationSchema = yup.object().shape({
  serverPath: yup
    .string()
    .trim()
    .required("This field is required.")
    .test("pathExists", "The path must exist on the server.", (value) => {
      return pathExists(value!)
        .then(({ data }) => data)
        .catch(() => false);
    }),
  isChecked: yup.boolean().nullable(),
});

export interface FormValue {
  serverPath: string;
  isChecked: boolean;
}

export interface RuleLabelServerPathFormProps {
  type: "Rule" | "Label";
  formRef?: any;
  initialValues?: FormValue;
  hideFormControls?: boolean;
  onSubmit?: (value: any) => void;
  onCancel?: () => void;
}

export const RuleLabelServerPathForm: React.FC<RuleLabelServerPathFormProps> = ({
  type,
  formRef,
  initialValues,
  hideFormControls,
  onSubmit,
  onCancel,
}) => {
  return (
    <Formik
      innerRef={formRef}
      validateOnMount
      validationSchema={validationSchema}
      initialValues={{
        serverPath: initialValues?.serverPath || "",
        isChecked: initialValues?.isChecked || false,
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
              label={`${type}s path (server-side file or directory)`}
              fieldId="serverPath"
              helperText="Path to the server-side file or directory containing the rules"
              isRequired={true}
              validated={getValidatedFromError(errors.serverPath)}
              helperTextInvalid={errors.serverPath}
            >
              <TextInput
                id="serverPath"
                type="text"
                name="serverPath"
                aria-describedby="server path"
                isRequired={true}
                onChange={onChangeField}
                onBlur={handleBlur}
                value={values.serverPath}
                validated={getValidatedFromErrorTouched(
                  errors.serverPath,
                  touched.serverPath
                )}
              />
            </FormGroup>
            <FormGroup
              label="Scan recursively (if it is a directory)"
              fieldId="isChecked"
              helperText=""
              isRequired={false}
              validated={getValidatedFromError(errors.isChecked)}
              helperTextInvalid={errors.isChecked}
            >
              <Checkbox
                id="isChecked"
                name="isChecked"
                aria-label="is checked"
                label={`If checked and given path is a directory, the subdirectories will also be scanned for ${type.toLocaleLowerCase()}sets`}
                onChange={onChangeField}
                onBlur={handleBlur}
                isChecked={values.isChecked}
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
