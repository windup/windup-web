import React, { useCallback } from "react";
import { FormikHandlers, FormikHelpers, FormikState } from "formik";

import { UploadFilesDropzoneWrapper } from "components";

import { UPLOAD_APPLICATION_PATH } from "api/api";
import { Application } from "models/api";
import { Constants } from "Constants";

export interface AddApplicationsUploadFilesFormValues {
  applications: Application[];
}

export interface AddApplicationsUploadFilesFormProps
  extends FormikState<AddApplicationsUploadFilesFormValues>,
    FormikHelpers<AddApplicationsUploadFilesFormValues>,
    FormikHandlers {
  projectId: string | number;
}

const getUploadUrl = (projectId: string | number) => {
  return UPLOAD_APPLICATION_PATH.replace(":projectId", projectId.toString());
};

export const AddApplicationsUploadFilesForm: React.FC<AddApplicationsUploadFilesFormProps> = ({
  projectId,
  values,
  setFieldValue,
}) => {
  const handleOnUploadChange = useCallback(
    (applications: Application[]) => {
      setFieldValue("applications", applications);
    },
    [setFieldValue]
  );

  return (
    <UploadFilesDropzoneWrapper
      value={values.applications}
      onChange={handleOnUploadChange}
      url={getUploadUrl(projectId)}
      accept={Constants.ALLOWED_APPLICATION_EXTENSIONS}
      template="dropdown-box"
      hideProgressOnSuccess={true}
    />
  );
};
