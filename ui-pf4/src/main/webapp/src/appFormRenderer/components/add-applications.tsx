import React, { useReducer, useEffect } from "react";
import { FormGroup } from "@patternfly/react-core";
import useFieldApi from "@data-driven-forms/react-form-renderer/dist/cjs/use-field-api";
import { UploadFilesSection } from "../../components";
import { Application } from "../../models/api";

interface Status {
  applications: Application[];
}
interface Action {
  type: "pushApplication" | "removeApplication";
  payload: any;
}

const reducer = (state: Status, action: Action): Status => {
  switch (action.type) {
    case "pushApplication":
      const afterPushApps = [...state.applications, action.payload.application];
      // action.payload.callback(afterPushApps);
      return {
        ...state,
        applications: afterPushApps,
      };
    case "removeApplication":
      const afterRemoveApps = state.applications.filter(
        (valueSelect: any) => valueSelect !== action.payload.application
      );
      // action.payload.callback(afterRemoveApps);
      return {
        ...state,
        applications: afterRemoveApps,
      };
    default:
      throw new Error();
  }
};

export const AddApplications = (originalProps: any) => {
  const { isRequired, label, helperText, hideLabel, meta, input } = useFieldApi(
    originalProps
  );

  const inputValue = input.value || [];

  const [state, dispatch] = useReducer(reducer, {
    applications: inputValue,
  } as Status);
  useEffect(() => {
    input.onChange(state.applications);
  }, [state.applications]);

  const handleOnFileUploadSuccess = (file: File, app: Application) => {
    dispatch({
      type: "pushApplication",
      payload: { application: app, callback: input.onChange },
    });
    input.onBlur();
  };

  const handleOnFileUploadError = (file: File, error: any) => {
    input.onBlur();
  };

  const handleApplicationRemove = (app: Application) => {
    dispatch({
      type: "removeApplication",
      payload: { application: app, callback: input.onChange },
    });
    input.onBlur();
  };

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
      <UploadFilesSection
        projectId={originalProps.projectId}
        applications={[...input.value]}
        onFileUploadSuccess={handleOnFileUploadSuccess}
        onFileUploadError={(file: File, error: any) => {
          handleOnFileUploadError(file, error);

          if (originalProps.onFileUploadError) {
            originalProps.onFileUploadError(file, error);
          }
        }}
        onApplicationRemove={handleApplicationRemove}
      />
    </FormGroup>
  );
};
