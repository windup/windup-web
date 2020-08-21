import React from "react";
import { FormGroup } from "@patternfly/react-core";
import useFieldApi from "@data-driven-forms/react-form-renderer/dist/cjs/use-field-api";
import { UploadFilesTab } from "../../components";

export const AddApplications = (originalProps: any) => {
  const { isRequired, label, helperText, hideLabel, meta, input } = useFieldApi(
    originalProps
  );

  const { error, touched } = meta;
  const showError = touched && error;

  return (
    <FormGroup
      isRequired={isRequired}
      label={!hideLabel && label}
      fieldId={input.name}
      helperText={helperText}
      helperTextInvalid={error}
      validated={showError ? "error" : "default"}
    >
      <UploadFilesTab
        fileFormName={originalProps.fileFormName}
        uploadFile={originalProps.uploadFile}
        onUploadFileSuccess={originalProps.onUploadFileSuccess}
        onUploadFileError={originalProps.onUploadFileError}
      />
    </FormGroup>
  );
};
