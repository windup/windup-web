import { object, string } from "yup";

import { MigrationProject } from "models/api";
import { getProjectIdByName } from "api/api";

import { ProjectDetailsFormValues } from "./project-details-form";

export const projectDetailsFormInitialValue = (
  project?: MigrationProject
): ProjectDetailsFormValues => {
  return {
    name: project?.title || "",
    description: project?.description || "",
  };
};

export const projectDetailsFormSchema = (project?: MigrationProject) => {
  const validationSchema = object<ProjectDetailsFormValues>().shape({
    name: string()
      .trim()
      .required("This field is required.")
      .min(3, "The project name must contain at least 3 characters.")
      .max(120, "The project name must contain fewer than 120 characters.")
      .matches(
        /\s*[- \w]+\s*/,
        "The project name must contain only alphanumeric characters."
      )
      .test("uniqueValue", "The entered name is already in use.", (value) => {
        return getProjectIdByName(value!)
          .then(({ data }) => {
            const isValid: boolean =
              data === "" ||
              data === undefined ||
              data === null ||
              project?.title === value;
            return isValid;
          })
          .catch(() => false);
      }),
    description: string()
      .trim()
      .max(4096, "The description must contain fewer than 4096 characters."),
  });

  return validationSchema;
};
