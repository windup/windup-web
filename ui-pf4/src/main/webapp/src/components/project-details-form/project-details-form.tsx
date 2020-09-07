import * as React from "react";
import {
  Form,
  FormGroup,
  TextInput,
  TextArea,
  ActionGroup,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";

import { useFormik } from "formik";
import * as yup from "yup";

import { getProjectIdByName } from "api/api";
import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("This field is required.")
    .min(3, "The project name must contain at least 3 characters.")
    .max(120, "The project name must contain fewer than 120 characters.")
    .matches(
      /^.[a-zA-Z0-9_]+$/,
      "The project name must contain only alphanumeric characters."
    )
    .test("uniqueValue", "The entered name is already in use.", (value) => {
      return getProjectIdByName(value!)
        .then(({ data }) => !data)
        .catch(() => false);
    }),
  description: yup
    .string()
    .nullable()
    .trim()
    .max(4096, "The description must contain fewer than 4096 characters."),
});

export interface ProjectDetailsFormValue {
  name: string;
  description: string;
}

export interface ProjectDetailsFormProps {
  initialValues?: ProjectDetailsFormValue;
  isInitialValuesValid?: boolean;
  hideFormControls?: boolean;
  onChange?: (values: ProjectDetailsFormValue, isValid: boolean) => void;
  onSubmit?: (value: any) => void;
  onCancel?: () => void;
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  initialValues,
  isInitialValuesValid,
  hideFormControls,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const {
    values,
    errors,
    touched,
    isValid,
    isValidating,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues || {
      name: "",
      description: "",
    },
    initialErrors: isInitialValuesValid ? undefined : { name: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (onSubmit) {
        onSubmit(values);
      }
    },
  });

  // Skip first 'onChange' since the initial status is defined by 'isInitialValuesValid'
  const firstUseEfect = React.useRef(true);
  React.useEffect(() => {
    if (firstUseEfect.current) {
      firstUseEfect.current = false;
      return;
    }

    // TODO onChange should include 'isValidating' but it does not
    // contains correct value see https://github.com/formium/formik/issues/1624
    if (onChange) {
      onChange(values, isValid);
    }
  }, [values, isValid, onChange]);

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
          validated={getValidatedFromErrorTouched(errors.name, touched.name)}
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
};
