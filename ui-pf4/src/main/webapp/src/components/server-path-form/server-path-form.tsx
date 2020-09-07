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

import { useFormik } from "formik";
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
    .test(
      "pathExists",
      "The path must be an existing file or a non-empty directory on the server.",
      (value) => {
        return pathExists(value!)
          .then(({ data }) => data)
          .catch((error) => {
            console.log("catchhh", error);
            return false;
          });
      }
    ),
  isExploded: yup.boolean().nullable(),
});

export interface ProjectDetailsFormValue {
  serverPath: string;
  isExploded: boolean;
}

export interface ServerPathFormProps {
  initialValues?: ProjectDetailsFormValue;
  isInitialValuesValid?: boolean;
  hideFormControls?: boolean;
  onChange?: (values: ProjectDetailsFormValue, isValid: boolean) => void;
  onSubmit?: (value: any) => void;
  onCancel?: () => void;
}

export const ServerPathForm: React.FC<ServerPathFormProps> = ({
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
      serverPath: "",
      isExploded: false,
    },
    initialErrors: isInitialValuesValid ? undefined : { serverPath: "" },
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
        label="Directory path to applications"
        fieldId="serverPath"
        helperText=""
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
        label="If the directory contains an exploded application, select the check box below"
        fieldId="isExploded"
        helperText=""
        isRequired={false}
        validated={getValidatedFromError(errors.isExploded)}
        helperTextInvalid={errors.isExploded}
      >
        <Checkbox
          id="isExploded"
          name="isExploded"
          aria-label="is exploded"
          label="Directory is an exploded Java application archive"
          onChange={onChangeField}
          onBlur={handleBlur}
          isChecked={values.isExploded}
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
