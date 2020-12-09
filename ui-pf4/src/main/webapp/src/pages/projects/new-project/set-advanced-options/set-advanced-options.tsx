import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError } from "axios";
import { FormikHelpers, useFormik } from "formik";

import { Form } from "@patternfly/react-core";

import { AdvancedOptionsForm, ConditionalRender } from "components";
import {
  buildSchema,
  buildInitialValues,
} from "components/advanced-options-form/schema";
import { useFetchProject } from "hooks/useFetchProject";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import {
  configurationOptionActions,
  configurationOptionSelector,
} from "store/configurationOptions";
import { alertActions } from "store/alert";

import { getAlertModel } from "Constants";
import { formatPath, ProjectRoute } from "Paths";
import { AdvancedOption, AnalysisContext } from "models/api";
import { saveAnalysisContext, getAnalysisContext } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { useCancelWizard } from "../wizard/useCancelWizard";
import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import {
  getMaxAllowedStepToJumpTo,
  getPathFromStep,
} from "../wizard/wizard-utils";
import { WizardFooter } from "../wizard/project-wizard-footer";
import { LoadingWizardContent } from "../wizard/loading-content";

interface SetAdvancedOptionsProps extends RouteComponentProps<ProjectRoute> {}

export const SetAdvancedOptions: React.FC<SetAdvancedOptionsProps> = ({
  match,
  history,
}) => {
  const dispatch = useDispatch();
  const cancelWizard = useCancelWizard();

  /**
   * Fetch organization and analysisContext
   */

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject: loadProject,
  } = useFetchProject();

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  /**
   * Fetch windup configurationOptions
   */

  const configurationOptions = useSelector((state: RootState) =>
    configurationOptionSelector.configurationOptions(state)
  );
  const configurationOptionsFetchStatus = useSelector((state: RootState) =>
    configurationOptionSelector.status(state)
  );
  const configurationOptionsFetchError = useSelector((state: RootState) =>
    configurationOptionSelector.error(state)
  );

  useEffect(() => {
    if (!configurationOptions) {
      dispatch(configurationOptionActions.fetchConfigurationOptions());
    }
  }, [configurationOptions, dispatch]);

  //

  const fireOnSubmit = (nextStep: NewProjectWizardStepIds) => {
    formik.setFieldValue("nextStep", nextStep);
    formik.submitForm();
  };

  const handleOnSubmit = (
    formValues: any,
    formikHelpers: FormikHelpers<any>
  ) => {
    if (!project) {
      return;
    }

    getAnalysisContext(project.defaultAnalysisContextId)
      .then(({ data }) => {
        const newAdvanceedOptions: AdvancedOption[] = [];
        Object.keys(formValues)
          .filter((k) => k !== "nextStep")
          .forEach((key) => {
            const value = formValues[key];
            if (typeof value === "string" && value.trim().length > 0) {
              newAdvanceedOptions.push({
                name: key,
                value: value,
              } as AdvancedOption);
            } else if (typeof value === "boolean" && value === true) {
              newAdvanceedOptions.push({
                name: key,
                value: value.toString(),
              } as AdvancedOption);
            } else if (Array.isArray(value) && value.length > 0) {
              value.forEach((f) =>
                newAdvanceedOptions.push({
                  name: key,
                  value: f,
                } as AdvancedOption)
              );
            }
          });

        const body: AnalysisContext = {
          ...data,
          advancedOptions: newAdvanceedOptions,
        };

        return saveAnalysisContext(project.id, body, true);
      })
      .then(() => {
        history.push(
          formatPath(getPathFromStep(formValues.nextStep), {
            project: project.id,
          })
        );
      })
      .catch((error: AxiosError) => {
        formikHelpers.setSubmitting(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: false,
    validateOnBlur: false,
    initialValues:
      analysisContext && configurationOptions
        ? buildInitialValues(analysisContext, configurationOptions)
        : {},
    validationSchema: configurationOptions
      ? buildSchema(configurationOptions)
      : undefined,
    onSubmit: handleOnSubmit,
    initialErrors: !project ? { name: "" } : {},
  });

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    if (formik.dirty) {
      fireOnSubmit(newStep);
    } else {
      history.push(
        formatPath(getPathFromStep(newStep), {
          project: match.params.project,
        })
      );
    }
  };

  const handleOnNext = () => {
    fireOnSubmit(NewProjectWizardStepIds.REVIEW);
  };

  const handleOnBack = () => {
    if (formik.dirty) {
      fireOnSubmit(NewProjectWizardStepIds.CUSTOM_LABELS);
    } else {
      history.push(
        formatPath(getPathFromStep(NewProjectWizardStepIds.CUSTOM_LABELS), {
          project: match.params.project,
        })
      );
    }
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const currentStep = NewProjectWizardStepIds.ADVANCED_OPTIONS;
  const disableNav =
    isFetching ||
    configurationOptionsFetchStatus === "inProgress" ||
    formik.isSubmitting ||
    formik.isValidating;
  const canJumpUpto = formik.isValid
    ? getMaxAllowedStepToJumpTo(project, analysisContext)
    : currentStep;

  const footer = (
    <WizardFooter
      isDisabled={disableNav}
      isNextDisabled={disableNav}
      onBack={handleOnBack}
      onNext={handleOnNext}
      onCancel={handleOnCancel}
    />
  );

  return (
    <NewProjectWizard
      disableNav={disableNav}
      stepId={currentStep}
      canJumpUpTo={canJumpUpto}
      footer={footer}
      showErrorContent={fetchError || configurationOptionsFetchError}
      onGoToStep={handleOnGoToStep}
    >
      <ConditionalRender
        when={isFetching || configurationOptionsFetchStatus === "inProgress"}
        then={<LoadingWizardContent />}
      >
        <Form onSubmit={formik.handleSubmit}>
          {configurationOptions && (
            <AdvancedOptionsForm
              configurationOptions={configurationOptions}
              {...formik}
            />
          )}
        </Form>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
