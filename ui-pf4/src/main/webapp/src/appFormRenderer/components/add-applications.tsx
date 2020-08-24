import React from "react";
import { FormGroup } from "@patternfly/react-core";
import useFieldApi from "@data-driven-forms/react-form-renderer/dist/cjs/use-field-api";
import useFormApi from "@data-driven-forms/react-form-renderer/dist/cjs/use-form-api";
import { UploadFilesTab } from "../../components";

export const AddApplications = (originalProps: any) => {
  const { isRequired, label, helperText, hideLabel, meta, input } = useFieldApi(
    originalProps
  );

  const formOptions = useFormApi();
  console.log(formOptions.getState().values);

  // const [initialValue, setInitialValue] = useState(selectedAppId);

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
        removeFile={originalProps.removeFile}
        onUploadFileSuccess={originalProps.onUploadFileSuccess}
        onUploadFileError={originalProps.onUploadFileError}
      />
    </FormGroup>
  );
};
