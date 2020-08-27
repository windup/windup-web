import React from "react";
import { FormGroup } from "@patternfly/react-core";
import useFieldApi from "@data-driven-forms/react-form-renderer/dist/cjs/use-field-api";
import { SelectCardGallery } from "../../components";

export const SelectTransformationPath = (originalProps: any) => {
  const { isRequired, label, helperText, hideLabel, meta, input } = useFieldApi(
    originalProps
  );

  const inputValue = input.value || ["eap7"];

  const handleChange = (value: string[]) => {
    input.onChange(value);
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
      <SelectCardGallery value={inputValue} onChange={handleChange} />
    </FormGroup>
  );
};
