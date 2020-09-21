import * as React from "react";
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  ButtonVariant,
  Grid,
  GridItem,
  Select,
  SelectVariant,
  SelectOption,
  Switch,
  Tooltip,
} from "@patternfly/react-core";

import { Formik } from "formik";
import * as yup from "yup";

import "./advanced-options-form.scss";

import { validateAdvancedOptionValue } from "api/api";
import {
  AnalysisContext,
  ConfigurationOption,
  AdvancedOption,
} from "models/api";

import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";
import { useSelectionState } from "hooks/useSelectionState";
import { getMapKeys } from "utils/utils";

export interface ProjectDetailsFormValue {
  name: string;
  description: string;
}

export interface AdvancedOptionsFormProps {
  formRef?: any;
  availableOptions: ConfigurationOption[];
  analysisContext: AnalysisContext; // initial values
  hideFormControls?: boolean;
  onSubmit?: (value: any) => void;
  onCancel?: () => void;
}

enum FieldKey {
  // Dropdowns
  TARGET = "target",
  SOURCE = "source",
  INCLUDE_TAGS = "includeTags",
  EXCLUDE_TAGS = "excludeTags",

  // Input texts
  ADDITIONAL_CLASSPATH = "additionalClasspath",
  APPLICATION_NAME = "inputApplicationName",
  MAVENIZE_GROUP_ID = "mavenizeGroupId",
  IGNORE_PATH = "userIgnorePath",

  // Switch
  EXPORT_CSV = "exportCSV",
  TATTLETALE = "enableTattletale",
  CLASS_NOT_FOUND_ANALYSIS = "enableClassNotFoundAnalysis",
  COMPATIBLE_FILES_REPORT = "enableCompatibleFilesReport",
  EXPLODED_APP = "explodedApp",
  KEEP_WORK_DIRS = "keepWorkDirs",
  SKIP_REPORTS = "skipReports",
  ALLOW_NETWORK_ACCESS = "online",
  MAVENIZE = "mavenize",
  SOURCE_MODE = "sourceMode",
}

interface IFieldInfo {
  label: string;
  type: "dropdown" | "input" | "switch";
}

const Fields: Map<FieldKey, IFieldInfo> = new Map([
  // Dropdowns
  [
    FieldKey.TARGET,
    {
      label: "Target",
      type: "dropdown",
    },
  ],
  [
    FieldKey.SOURCE,
    {
      label: "Source",
      type: "dropdown",
    },
  ],
  [
    FieldKey.INCLUDE_TAGS,
    {
      label: "Include tags",
      type: "dropdown",
    },
  ],
  [
    FieldKey.EXCLUDE_TAGS,
    {
      label: "Exclude tags",
      type: "dropdown",
    },
  ],

  // Input fields
  [
    FieldKey.ADDITIONAL_CLASSPATH,
    {
      label: "Additional classpath",
      type: "input",
    },
  ],
  [
    FieldKey.APPLICATION_NAME,
    {
      label: "Application name",
      type: "input",
    },
  ],
  [
    FieldKey.MAVENIZE_GROUP_ID,
    {
      label: "Mavenize group ID",
      type: "input",
    },
  ],
  [
    FieldKey.IGNORE_PATH,
    {
      label: "Ignore path",
      type: "input",
    },
  ],

  // Switch
  [
    FieldKey.EXPORT_CSV,
    {
      label: "Export CSV",
      type: "switch",
    },
  ],
  [
    FieldKey.TATTLETALE,
    {
      label: "Tattletale",
      type: "switch",
    },
  ],
  [
    FieldKey.CLASS_NOT_FOUND_ANALYSIS,
    {
      label: "'Class Not Found' analysis",
      type: "switch",
    },
  ],
  [
    FieldKey.COMPATIBLE_FILES_REPORT,
    {
      label: "'Compatible Files' report",
      type: "switch",
    },
  ],
  [
    FieldKey.EXPLODED_APP,
    {
      label: "Exploded app",
      type: "switch",
    },
  ],
  [
    FieldKey.KEEP_WORK_DIRS,
    {
      label: "Keep work dirs",
      type: "switch",
    },
  ],
  [
    FieldKey.SKIP_REPORTS,
    {
      label: "Skip reports",
      type: "switch",
    },
  ],
  [
    FieldKey.ALLOW_NETWORK_ACCESS,
    {
      label: "Allow network access",
      type: "switch",
    },
  ],
  [
    FieldKey.MAVENIZE,
    {
      label: "Mavenize",
      type: "switch",
    },
  ],
  [
    FieldKey.SOURCE_MODE,
    {
      label: "Source mode",
      type: "switch",
    },
  ],
]);

const findAdvanvedOptionById = (
  name: string,
  availableOptions: ConfigurationOption[]
) => {
  return availableOptions.find((f) => f.name === name);
};

const getFieldData = (
  fieldKey: FieldKey,
  availableOptions: ConfigurationOption[]
): [IFieldInfo, ConfigurationOption] => {
  const fieldInfo = Fields.get(fieldKey);
  const fieldConfiguration:
    | ConfigurationOption
    | undefined = findAdvanvedOptionById(fieldKey, availableOptions);

  if (!fieldConfiguration || !fieldInfo) {
    throw Error("FieldKey=" + fieldKey + " doesn't match available option");
  }

  return [fieldInfo, fieldConfiguration];
};

export const AdvancedOptionsForm: React.FC<AdvancedOptionsFormProps> = ({
  availableOptions,
  analysisContext,
  hideFormControls,
  formRef,
  onCancel,
  onSubmit,
}) => {
  const [dropdowns] = React.useState<FieldKey[]>(
    getMapKeys(Fields).filter((f) => f.type === "dropdown")
  );
  const dropdownCollapse = useSelectionState({
    items: dropdowns,
    initialSelected: [],
    isEqual: (a, b) => a === b,
  });
  const onDropdownToggle = (key: FieldKey, isExpanded?: boolean) => {
    dropdownCollapse.toggleItemSelected(key, isExpanded);
  };

  const getValidationSchema = () => {
    const schema: any = {};

    getMapKeys(Fields).forEach((fieldKey: FieldKey) => {
      const [fieldInfo, fieldConfiguration] = getFieldData(
        fieldKey,
        availableOptions
      );

      switch (fieldInfo.type) {
        case "dropdown":
          schema[fieldKey] = yup.array().nullable();
          break;
        case "input":
          schema[fieldKey] = yup.string().nullable().trim();
          break;
        case "switch":
          schema[fieldKey] = yup.boolean().nullable();
          break;
      }

      let fieldSchema:
        | yup.ArraySchema<any>
        | yup.StringSchema<any>
        | yup.BooleanSchema<any> = schema[fieldKey];
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
            throw Error("Invalid type, can not validate:" + value);
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
              const isValid = responses.every(
                (f) => f.data.level === "SUCCESS"
              );

              return !isValid
                ? new yup.ValidationError(
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

    return yup.object().shape(schema);
  };

  const getInitialValues = () => {
    let result: any = {};

    getMapKeys(Fields).forEach((fieldKey: FieldKey) => {
      const [fieldInfo] = getFieldData(fieldKey, availableOptions);

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

  return (
    <Formik
      innerRef={formRef}
      validateOnMount
      validationSchema={getValidationSchema()}
      initialValues={getInitialValues()}
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        isValidating,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => {
        const onChangeField = (_value: any, event: any) => {
          handleChange(event);
        };

        return (
          <Form onSubmit={handleSubmit}>
            <Grid hasGutter md={6}>
              <GridItem md={8} className="pf-c-form pf-m-horizontal">
                {
                  // Dropdowns
                  getMapKeys(Fields)
                    .filter((f) => Fields.get(f)?.type === "dropdown")
                    .map((fieldKey: FieldKey, index) => {
                      const [fieldInfo, fieldConfiguration] = getFieldData(
                        fieldKey,
                        availableOptions
                      );

                      return (
                        <FormGroup
                          key={`${fieldInfo.type}-${index}`}
                          label={
                            <Tooltip
                              content={
                                <div>{fieldConfiguration.description}</div>
                              }
                            >
                              <span>{fieldInfo.label}</span>
                            </Tooltip>
                          }
                          fieldId={fieldKey}
                          helperText=""
                          isRequired={fieldConfiguration.required}
                          validated={getValidatedFromError(errors[fieldKey])}
                          helperTextInvalid={errors[fieldKey]}
                        >
                          <Select
                            variant={SelectVariant.typeaheadMulti}
                            typeAheadAriaLabel="Select"
                            onToggle={(isExpanded) => {
                              onDropdownToggle(fieldKey, isExpanded);
                            }}
                            onSelect={(_, selection) => {
                              if (
                                values[fieldKey].includes(selection as string)
                              ) {
                                setFieldValue(
                                  fieldKey,
                                  values[fieldKey].filter(
                                    (f: any) => f !== selection
                                  )
                                );
                              } else {
                                setFieldValue(fieldKey, [
                                  ...values[fieldKey],
                                  selection,
                                ]);
                              }
                            }}
                            onClear={() => setFieldValue(fieldKey, [])}
                            selections={values[fieldKey]}
                            isOpen={dropdownCollapse.isItemSelected(fieldKey)}
                            aria-labelledby="Select"
                            placeholderText="Select a state"
                            isCreatable={false}
                          >
                            {fieldConfiguration.availableValues.map(
                              (option, i) => (
                                <SelectOption key={i} value={option} />
                              )
                            )}
                          </Select>
                        </FormGroup>
                      );
                    })
                }
                {
                  // Input fields
                  getMapKeys(Fields)
                    .filter((f) => Fields.get(f)?.type === "input")
                    .map((fieldKey: FieldKey, index) => {
                      const [fieldInfo, fieldConfiguration] = getFieldData(
                        fieldKey,
                        availableOptions
                      );

                      return (
                        <FormGroup
                          key={`${fieldInfo.type}-${index}`}
                          label={
                            <Tooltip
                              content={
                                <div>{fieldConfiguration.description}</div>
                              }
                            >
                              <span>{fieldInfo.label}</span>
                            </Tooltip>
                          }
                          fieldId={fieldKey}
                          helperText=""
                          isRequired={fieldConfiguration.required}
                          validated={getValidatedFromError(errors[fieldKey])}
                          helperTextInvalid={errors[fieldKey]}
                        >
                          <TextInput
                            id={fieldKey}
                            type="text"
                            name={fieldKey}
                            aria-describedby={fieldKey}
                            isRequired={fieldConfiguration.required}
                            onChange={onChangeField}
                            onBlur={handleBlur}
                            value={values[fieldKey]}
                            validated={getValidatedFromErrorTouched(
                              errors[fieldKey],
                              touched[fieldKey] as any
                            )}
                          />
                        </FormGroup>
                      );
                    })
                }
              </GridItem>
              <GridItem
                md={4}
                className="pf-c-form pf-m-horizontal pf-c-form-advanced-options"
              >
                {getMapKeys(Fields)
                  .filter((f) => Fields.get(f)?.type === "switch")
                  .map((fieldKey: FieldKey, index) => {
                    const [fieldInfo, fieldConfiguration] = getFieldData(
                      fieldKey,
                      availableOptions
                    );

                    return (
                      <FormGroup
                        key={`${fieldInfo.type}-${index}`}
                        label={
                          <Tooltip
                            content={
                              <div>{fieldConfiguration.description}</div>
                            }
                          >
                            <span>{fieldInfo.label}</span>
                          </Tooltip>
                        }
                        fieldId={fieldKey}
                        helperText=""
                        isRequired={fieldConfiguration.required}
                        validated={getValidatedFromError(errors[fieldKey])}
                        helperTextInvalid={errors[fieldKey]}
                        hasNoPaddingTop
                      >
                        <Switch
                          label=""
                          aria-label={fieldInfo.label}
                          isChecked={values[fieldKey]}
                          onChange={(checked) => {
                            setFieldValue(fieldKey, checked);
                          }}
                        />
                      </FormGroup>
                    );
                  })}
              </GridItem>
            </Grid>
            {!hideFormControls && (
              <ActionGroup>
                <Button
                  type="submit"
                  variant={ButtonVariant.primary}
                  isDisabled={!isValid || isSubmitting || isValidating}
                >
                  Save
                </Button>
                <Button variant={ButtonVariant.link} onClick={onCancel}>
                  Cancel
                </Button>
              </ActionGroup>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
