import * as yup from "yup";

import { pathExists } from "api/api";
import { MigrationProject } from "models/api";

import { AddApplicationsServerPathFormValues } from "./add-applications-serverpath-form";
import { AddApplicationsUploadFilesFormValues } from "./add-applications-uploadfiles-form";

export const AddApplicationsServerPathFormSchemaInitialValues = (): AddApplicationsServerPathFormValues => {
  return { serverPath: "", isExploded: false };
};

export const AddApplicationsUploadFilesFormInitialValues = (
  project?: MigrationProject
): AddApplicationsUploadFilesFormValues => {
  return { applications: project ? project.applications : [] };
};

export const AddApplicationsServerPathFormSchema = () => {
  const validationSchema = yup
    .object<AddApplicationsServerPathFormValues>()
    .shape({
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
                return false;
              });
          }
        ),
      isExploded: yup.boolean(),
    });

  return validationSchema;
};

export const AddApplicationsUploadFilesFormSchema = (isRequired: boolean) => {
  if (isRequired) {
    return yup.object<AddApplicationsUploadFilesFormValues>().shape({
      applications: yup.array().required("This field is required.").min(1),
    });
  } else {
    return yup.object<AddApplicationsUploadFilesFormValues>().shape({
      applications: yup.array(),
    });
  }
};
