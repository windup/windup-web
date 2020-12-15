import React from "react";
import { FormGroup, TextInput, Checkbox } from "@patternfly/react-core";

import { FormikHandlers, FormikState } from "formik";

import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";

export interface AddApplicationsServerPathFormValues {
  serverPath: string;
  isExploded: boolean;
}

export interface AddApplicationsServerPathFormProps
  extends FormikState<AddApplicationsServerPathFormValues>,
    FormikHandlers {}

export const AddApplicationsServerPathForm: React.FC<AddApplicationsServerPathFormProps> = ({
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
        label="Server-side path to applications"
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
        label="If the directory contains Java source code or an exploded application, select the check box below"
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
          label="Directory contains the application's source code or an exploded Java application archive"
          onChange={onChangeField}
          onBlur={handleBlur}
          isChecked={values.isExploded}
        />
      </FormGroup>
    </>
  );
};
