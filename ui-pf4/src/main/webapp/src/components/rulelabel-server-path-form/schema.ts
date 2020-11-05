import { object, string, boolean } from "yup";

import { pathExists } from "api/api";

import { RuleLabelServerPathFormValues } from "./rulelabel-server-path-form";

export const RuleLabelServerPathFormSchema = () => {
  const validationSchema = object<RuleLabelServerPathFormValues>().shape({
    serverPath: string()
      .trim()
      .required("This field is required.")
      .test("pathExists", "The path must exist on the server.", (value) => {
        return pathExists(value!)
          .then(({ data }) => data)
          .catch(() => false);
      }),
    isChecked: boolean().nullable(),
  });

  return validationSchema;
};
