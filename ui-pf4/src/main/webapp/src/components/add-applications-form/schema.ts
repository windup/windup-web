import { object, string, boolean, array } from "yup";

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
  const validationSchema = object<AddApplicationsServerPathFormValues>().shape({
    serverPath: string()
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
    isExploded: boolean(),
  });

  return validationSchema;
};

export const AddApplicationsUploadFilesFormSchema = (isRequired: boolean) => {
  if (isRequired) {
    return object<AddApplicationsUploadFilesFormValues>().shape({
      applications: array().required("This field is required.").min(1),
    });
  } else {
    return object<AddApplicationsUploadFilesFormValues>().shape({
      applications: array(),
    });
  }
};
