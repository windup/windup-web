import React from "react";
import {
  FormGroup,
  TextInput,
  Grid,
  GridItem,
  Select,
  SelectVariant,
  SelectOption,
  Switch,
  Tooltip,
  Stack,
  StackItem,
  TextContent,
  Title,
  TitleSizes,
  Text,
} from "@patternfly/react-core";

import { FormikHandlers, FormikHelpers, FormikState } from "formik";

import "./advanced-options-form.scss";

import { useSelectionState } from "hooks/useSelectionState";

import { AdvancedOptionsFieldKey } from "Constants";
import { ConfigurationOption } from "models/api";
import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/formUtils";

import { filterFieldsByType, getFieldData, Fields, IFieldInfo } from "./schema";

const tooltipTextFrom = (info: IFieldInfo, config: ConfigurationOption) => {
  return info.description ? info.description : config.description;
};

interface FormValues {
  [AdvancedOptionsFieldKey.TARGET]: string[];
  [AdvancedOptionsFieldKey.SOURCE]?: string[];
  // [AdvancedOptionsFieldKey.INCLUDE_TAGS]?: string[];
  [AdvancedOptionsFieldKey.EXCLUDE_TAGS]?: string[];

  [AdvancedOptionsFieldKey.ADDITIONAL_CLASSPATH]?: string;
  [AdvancedOptionsFieldKey.APPLICATION_NAME]?: string;
  [AdvancedOptionsFieldKey.MAVENIZE_GROUP_ID]?: string;
  [AdvancedOptionsFieldKey.IGNORE_PATH]?: string;

  [AdvancedOptionsFieldKey.EXPORT_CSV]?: boolean;
  [AdvancedOptionsFieldKey.TATTLETALE]?: boolean;
  [AdvancedOptionsFieldKey.CLASS_NOT_FOUND_ANALYSIS]?: boolean;
  [AdvancedOptionsFieldKey.COMPATIBLE_FILES_REPORT]?: boolean;
  [AdvancedOptionsFieldKey.EXPLODED_APP]?: boolean;
  [AdvancedOptionsFieldKey.KEEP_WORK_DIRS]?: boolean;
  [AdvancedOptionsFieldKey.SKIP_REPORTS]?: boolean;
  [AdvancedOptionsFieldKey.ALLOW_NETWORK_ACCESS]?: boolean;
  [AdvancedOptionsFieldKey.MAVENIZE]?: boolean;
  [AdvancedOptionsFieldKey.SOURCE_MODE]?: boolean;
}

export interface AdvancedOptionsFormProps
  extends FormikState<FormValues>,
    FormikHandlers,
    FormikHelpers<FormValues> {
  configurationOptions: ConfigurationOption[];
}

export const AdvancedOptionsForm: React.FC<AdvancedOptionsFormProps> = ({
  configurationOptions,

  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  setFieldValue,
}) => {
  // Dropdown

  const dropdownCollapse = useSelectionState({
    items: filterFieldsByType("dropdown", Fields),
    initialSelected: [],
    isEqual: (a, b) => a === b,
  });

  const handleOnDropdownToggle = (
    key: AdvancedOptionsFieldKey,
    isExpanded?: boolean
  ) => {
    dropdownCollapse.toggleItemSelected(key, isExpanded);
  };

  const handleOnDropdownSelect = (
    field: AdvancedOptionsFieldKey,
    value: string
  ) => {
    const currentValues = values[field];
    if (!Array.isArray(currentValues)) {
      throw new Error("Dropdown values must be string[]");
    }

    if (currentValues.includes(value)) {
      setFieldValue(
        field,
        currentValues.filter((f) => f !== value)
      );
    } else {
      setFieldValue(field, [...currentValues, value]);
    }
  };

  const onClearDropdown = (field: AdvancedOptionsFieldKey) => {
    setFieldValue(field, []);
  };

  // Input

  const onChangeField = (_value: any, event: any) => {
    handleChange(event);
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Title headingLevel="h5" size={TitleSizes["lg"]}>
            Advanced options
          </Title>
          <Text component="small">Specify additional options here.</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Grid hasGutter>
          <GridItem md={7} className="pf-c-form pf-m-horizontal">
            {
              // Dropdowns
              filterFieldsByType("dropdown", Fields).map((field, index) => {
                const [fieldInfo, fieldConfiguration] = getFieldData(
                  field,
                  Fields,
                  configurationOptions
                );

                return (
                  <FormGroup
                    key={`${fieldInfo.type}-${index}`}
                    label={
                      <Tooltip
                        content={tooltipTextFrom(fieldInfo, fieldConfiguration)}
                      >
                        <span>{fieldInfo.label}</span>
                      </Tooltip>
                    }
                    fieldId={field}
                    helperText=""
                    isRequired={fieldConfiguration.required}
                    validated={getValidatedFromError(errors[field])}
                    helperTextInvalid={errors[field]}
                  >
                    <Select
                      variant={SelectVariant.typeaheadMulti}
                      typeAheadAriaLabel="Select"
                      onToggle={(isExpanded) =>
                        handleOnDropdownToggle(field, isExpanded)
                      }
                      onSelect={(_, selection) =>
                        handleOnDropdownSelect(field, selection as string)
                      }
                      onClear={() => onClearDropdown(field)}
                      selections={values[field]}
                      isOpen={dropdownCollapse.isItemSelected(field)}
                      aria-labelledby="Select"
                      placeholderText={
                        fieldInfo.placeholder ? fieldInfo.placeholder : ""
                      }
                      isCreatable={true}
                      onCreateOption={(newOptionVal) => {
                        handleOnDropdownSelect(field, newOptionVal);
                      }}
                    >
                      {[...fieldConfiguration.availableValues]
                        .sort()
                        .map((option, i) => (
                          <SelectOption key={i} value={option} />
                        ))}
                    </Select>
                  </FormGroup>
                );
              })
            }
            {
              // Input fields
              filterFieldsByType("input", Fields).map((field, index) => {
                const [fieldInfo, fieldConfiguration] = getFieldData(
                  field,
                  Fields,
                  configurationOptions
                );

                return (
                  <FormGroup
                    key={`${fieldInfo.type}-${index}`}
                    label={
                      <Tooltip
                        content={tooltipTextFrom(fieldInfo, fieldConfiguration)}
                      >
                        <span>{fieldInfo.label}</span>
                      </Tooltip>
                    }
                    fieldId={field}
                    helperText=""
                    isRequired={fieldConfiguration.required}
                    validated={getValidatedFromError(errors[field])}
                    helperTextInvalid={errors[field]}
                  >
                    <TextInput
                      id={field}
                      type="text"
                      name={field}
                      aria-describedby={field}
                      isRequired={fieldConfiguration.required}
                      onChange={onChangeField}
                      onBlur={handleBlur}
                      value={values[field] as string}
                      validated={getValidatedFromErrorTouched(
                        errors[field],
                        touched[field] as any
                      )}
                    />
                  </FormGroup>
                );
              })
            }
          </GridItem>
          <GridItem
            md={4}
            mdOffset={8}
            className="pf-c-form pf-m-horizontal pf-c-form-advanced-options"
          >
            {filterFieldsByType("switch", Fields).map((field, index) => {
              const [fieldInfo, fieldConfiguration] = getFieldData(
                field,
                Fields,
                configurationOptions
              );

              return (
                <FormGroup
                  key={`${fieldInfo.type}-${index}`}
                  label={
                    <Tooltip
                      content={tooltipTextFrom(fieldInfo, fieldConfiguration)}
                    >
                      <span>{fieldInfo.label}</span>
                    </Tooltip>
                  }
                  fieldId={field}
                  helperText=""
                  isRequired={fieldConfiguration.required}
                  validated={getValidatedFromError(errors[field])}
                  helperTextInvalid={errors[field]}
                  hasNoPaddingTop
                >
                  <Switch
                    label=""
                    aria-label={fieldInfo.label}
                    isChecked={values[field] as boolean}
                    onChange={(checked) => {
                      setFieldValue(field, checked);
                    }}
                  />
                </FormGroup>
              );
            })}
          </GridItem>
        </Grid>
      </StackItem>
    </Stack>
  );
};
