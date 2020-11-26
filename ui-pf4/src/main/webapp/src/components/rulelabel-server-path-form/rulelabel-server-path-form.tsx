import React from "react";
import { FormGroup, TextInput, Checkbox } from "@patternfly/react-core";

import { FormikHandlers, FormikState } from "formik";

import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";
import { RuleLabel } from "models/api";

export interface RuleLabelServerPathFormValues {
  serverPath: string;
  isChecked: boolean;
}

export interface RuleLabelServerPathFormProps
  extends FormikState<RuleLabelServerPathFormValues>,
    FormikHandlers {
  type: RuleLabel;
}

export const RuleLabelServerPathForm: React.FC<RuleLabelServerPathFormProps> = ({
  type,
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
      <FormGroup
        label={`${type}s path (server-side file or directory)`}
        fieldId="serverPath"
        helperText={`Path to the file or directory containing the ${type.toLocaleLowerCase()}s.`}
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
          label={`If checked and the given path is a directory, the subdirectories will also be scanned for ${type.toLocaleLowerCase()}sets`}
          onChange={onChangeField}
          onBlur={handleBlur}
          isChecked={values.isChecked}
        />
      </FormGroup>
    </>
  );
};
