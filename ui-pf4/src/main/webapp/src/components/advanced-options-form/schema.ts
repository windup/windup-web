import {
  object,
  string,
  boolean,
  array,
  ValidationError,
  ArraySchema,
  BooleanSchema,
  StringSchema,
} from "yup";

import { AdvancedOptionsFieldKey } from "Constants";
import { getMapKeys } from "utils/utils";

import {
  AdvancedOption,
  AnalysisContext,
  ConfigurationOption,
} from "models/api";
import { validateAdvancedOptionValue } from "api/api";

type FieldType = "dropdown" | "input" | "switch";

export interface IFieldInfo {
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
}

export const Fields: Map<AdvancedOptionsFieldKey, IFieldInfo> = new Map([
  // Dropdowns
  [
    AdvancedOptionsFieldKey.TARGET,
    {
      label: "Target",
      type: "dropdown",
      placeholder: "Select targets",
      description:
        'The target server/technology/framework to migrate to. This could include multiple items (e.g., "eap7" and "cloud-readiness") separated by a space.',
    },
  ],
  [
    AdvancedOptionsFieldKey.SOURCE,
    {
      label: "Source",
      type: "dropdown",
      placeholder: "Select sources",
      description:
        'The source server/technology/framework to migrate from. This could include multiple items (e.g., "eap" and "springboot") separated by a space.',
    },
  ],
  // [
  //   AdvancedOptionsFieldKey.INCLUDE_TAGS,
  //   {
  //     label: "Include tags",
  //     type: "dropdown",
  //     placeholder: "Select tags",
  //   },
  // ],
  [
    AdvancedOptionsFieldKey.EXCLUDE_TAGS,
    {
      label: "Exclude tags",
      type: "dropdown",
      placeholder: "Select tags",
    },
  ],

  // Input fields
  [
    AdvancedOptionsFieldKey.ADDITIONAL_CLASSPATH,
    {
      label: "Additional classpath",
      type: "input",
      description: "Adds additional files or directories to the classpath.",
    },
  ],
  [
    AdvancedOptionsFieldKey.APPLICATION_NAME,
    {
      label: "Application name",
      type: "input",
    },
  ],
  [
    AdvancedOptionsFieldKey.MAVENIZE_GROUP_ID,
    {
      label: "Mavenize group ID",
      type: "input",
    },
  ],
  [
    AdvancedOptionsFieldKey.IGNORE_PATH,
    {
      label: "Ignore path",
      type: "input",
    },
  ],

  // Switch
  [
    AdvancedOptionsFieldKey.EXPORT_CSV,
    {
      label: "Export CSV",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.TATTLETALE,
    {
      label: "Disable Tattletale",
      type: "switch",
      description:
        "Use this option to disable the Tattletale reports, which are enabled by default.",
    },
  ],
  [
    AdvancedOptionsFieldKey.CLASS_NOT_FOUND_ANALYSIS,
    {
      label: "Class Not Found analysis",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.COMPATIBLE_FILES_REPORT,
    {
      label: "Compatible Files report",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.EXPLODED_APP,
    {
      label: "Exploded app",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.KEEP_WORK_DIRS,
    {
      label: "Keep work dirs",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.SKIP_REPORTS,
    {
      label: "Skip reports",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.ALLOW_NETWORK_ACCESS,
    {
      label: "Allow network access",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.MAVENIZE,
    {
      label: "Mavenize",
      type: "switch",
    },
  ],
  [
    AdvancedOptionsFieldKey.SOURCE_MODE,
    {
      label: "Source mode",
      type: "switch",
      description:
        "Indicates whether the input file or directory is a source code or compiled binaries (default).",
    },
  ],
]);

// Schema

export const buildSchema = (availableOptions: ConfigurationOption[]) => {
  const schema: any = {};

  getMapKeys(Fields).forEach((fieldKey: AdvancedOptionsFieldKey) => {
    const [fieldInfo, fieldConfiguration] = getFieldData(
      fieldKey,
      Fields,
      availableOptions
    );

    switch (fieldInfo.type) {
      case "dropdown":
        schema[fieldKey] = array().nullable();
        break;
      case "input":
        schema[fieldKey] = string().nullable().trim();
        break;
      case "switch":
        schema[fieldKey] = boolean().nullable();
        break;
    }

    let fieldSchema: ArraySchema<any> | StringSchema<any> | BooleanSchema<any> =
      schema[fieldKey];
    if (fieldConfiguration.required) {
      schema[fieldKey] = fieldSchema.required();
    }

    fieldSchema = schema[fieldKey];
    schema[fieldKey] = fieldSchema.test(
      "invalidValue",
      "The entered name is invalid.",
      (value) => {
        if (!value) return true;

        let values: any[];
        if (typeof value === "string" || typeof value === "boolean") {
          values = [value];
        } else if (Array.isArray(value)) {
          values = value;
        } else {
          throw new Error("Invalid type, can not validate:" + value);
        }

        return Promise.all(
          values.map((f) =>
            validateAdvancedOptionValue({
              name: fieldKey,
              value: f,
            } as AdvancedOption)
          )
        )
          .then((responses) => {
            const isValid = responses.every((f) => f.data.level === "SUCCESS");

            return !isValid
              ? new ValidationError(
                  responses.map((f) => f.data.message),
                  value,
                  fieldKey
                )
              : true;
          })
          .catch(() => false);
      }
    );
  });

  return object().shape(schema);
};

// Initial values
export const buildInitialValues = (
  analysisContext: AnalysisContext,
  availableOptions: ConfigurationOption[]
) => {
  let result: any = {};

  getMapKeys(Fields).forEach((fieldKey: AdvancedOptionsFieldKey) => {
    const [fieldInfo] = getFieldData(fieldKey, Fields, availableOptions);

    const dbValues = analysisContext.advancedOptions.filter(
      (f) => f.name === fieldKey
    );

    switch (fieldInfo.type) {
      case "dropdown":
        result = {
          ...result,
          [fieldKey]: dbValues.map((f) => f.value) || [],
        };
        break;
      case "input":
        result = {
          ...result,
          [fieldKey]: dbValues.map((f) => f.value).join(" ") || "",
        };
        break;
      case "switch":
        result = {
          ...result,
          [fieldKey]: dbValues.reduce(
            (prev, { value }) => prev || value === "true",
            false
          ),
        };
        break;
    }
  });

  return result;
};

// Utils
export const filterFieldsByType = (
  type: FieldType,
  fields: Map<AdvancedOptionsFieldKey, IFieldInfo>
) => {
  return Array.from(fields.keys()).filter((f) => fields.get(f)?.type === type);
};

export const getFieldData = (
  key: AdvancedOptionsFieldKey,
  fields: Map<AdvancedOptionsFieldKey, IFieldInfo>,
  availableOptions: ConfigurationOption[]
): [IFieldInfo, ConfigurationOption] => {
  const fieldInfo = fields.get(key);
  const fieldConfiguration = availableOptions.find((f) => f.name === key);

  if (!fieldConfiguration || !fieldInfo) {
    throw new Error("FieldKey=" + key + " doesn't match available option");
  }

  return [fieldInfo, fieldConfiguration];
};
