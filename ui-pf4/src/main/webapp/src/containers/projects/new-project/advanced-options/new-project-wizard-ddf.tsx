import * as React from "react";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  AlertActionCloseButton,
  Alert,
  Button,
} from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";
import useFormApi from "@data-driven-forms/react-form-renderer/dist/cjs/use-form-api";
import FormSpy from "@data-driven-forms/react-form-renderer/dist/cjs/form-spy";

import NewProjectWizard from "../";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";

export const FormTemplateNewWizard: React.FC<any> = ({
  schema,
  formFields,
  formRef,
}) => {
  const { handleSubmit, onReset, onCancel, getState, submit } = useFormApi();
  const { submitting, valid, pristine } = getState();

  // function FancyInput(props, ref) {
  //   const inputRef = useRef();
  //   useImperativeHandle(ref, () => ({
  //     focus: () => {
  //       inputRef.current.focus();
  //     }
  //   }));
  //   return <input ref={inputRef} ... />;
  // }
  // FancyInput = forwardRef(FancyInput);

  // const FancyForm = React.forwardRef((props: any, ref: any) => {
  //   const formRef = React.useRef();
  //   React.useImperativeHandle(ref, () => {

  //   });
  //   return (
  //     <form ref={ref} onSubmit={handleSubmit}>
  //       {props.children}
  //     </form>
  //   );
  // });

  // return (
  //   <form ref={formRef} onSubmit={handleSubmit}>
  //     {schema.title}
  //     {formFields}
  //   </form>
  // );

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {schema.title}
      {formFields}
      <FormSpy>
        {() => (
          <div style={{ marginTop: 8 }}>
            <Button
              disabled={submitting || !valid}
              style={{ marginRight: 8 }}
              type="submit"
              color="primary"
            >
              Submit
            </Button>
            <Button
              disabled={pristine}
              style={{ marginRight: 8 }}
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
        )}
      </FormSpy>
    </form>
  );
};
