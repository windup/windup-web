import React, { useEffect, useMemo } from "react";
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
import { formatPath, Paths, ProjectRoute } from "Paths";
import { AdvancedOption, AnalysisContext } from "models/api";
import { saveAnalysisContext, getAnalysisContext } from "api/api";
import {
  getAxiosErrorMessage,
  getEnabledCustomSourcesAndTargets,
} from "utils/modelUtils";

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
import { useFetchRules } from "hooks/useFetchRules";

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
    isFetching: isFetchingProject,
    fetchError: fetchProjectError,
    fetchProject: loadProject,
  } = useFetchProject();

  const {
    rulesPath: rulesPathGlobalScope,
    ruleProviders: ruleProvidersGlobalScope,
    isFetching: isFetchingRulesGlobalScope,
    fetchError: fetchRulesErrorGlobalScope,
    loadGlobalRules: loadRulesGlobalScope,
  } = useFetchRules();

  const {
    rulesPath: rulesPathProjectScope,
    ruleProviders: ruleProvidersProjectScope,
    isFetching: isFetchingRulesProjectScope,
    fetchError: fetchRulesErrorProjectScope,
    loadRules: loadRulesProjectScope,
  } = useFetchRules();

  useEffect(() => {
    loadProject(match.params.project);

    loadRulesGlobalScope();
    loadRulesProjectScope(match.params.project);
  }, [match, loadProject, loadRulesGlobalScope, loadRulesProjectScope]);

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

  /**
   * Process custom rules
   */
  const userProvidedSourcesAndTargets = useMemo(() => {
    if (
      analysisContext &&
      rulesPathGlobalScope &&
      ruleProvidersGlobalScope &&
      rulesPathProjectScope &&
      ruleProvidersProjectScope &&
      !isFetchingProject &&
      !isFetchingRulesProjectScope &&
      !isFetchingRulesGlobalScope
    ) {
      const projectScopedSourceAndTargets = getEnabledCustomSourcesAndTargets(
        analysisContext,
        rulesPathProjectScope,
        ruleProvidersProjectScope
      );
      const globalScopedSourceAndTargets = getEnabledCustomSourcesAndTargets(
        analysisContext,
        rulesPathGlobalScope.filter((f) => f.rulesPathType === "USER_PROVIDED"),
        ruleProvidersGlobalScope
      );

      return {
        sources: new Set([
          ...Array.from(projectScopedSourceAndTargets.sources.values()),
          ...Array.from(globalScopedSourceAndTargets.sources.values()),
        ]),
        targets: new Set([
          ...Array.from(projectScopedSourceAndTargets.targets.values()),
          ...Array.from(globalScopedSourceAndTargets.targets.values()),
        ]),
      };
    }
  }, [
    isFetchingProject,
    isFetchingRulesGlobalScope,
    isFetchingRulesProjectScope,
    analysisContext,
    rulesPathGlobalScope,
    ruleProvidersGlobalScope,
    rulesPathProjectScope,
    ruleProvidersProjectScope,
  ]);

  //

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
        Object.keys(formValues).forEach((key) => {
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
          formatPath(Paths.newProject_review, {
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
        : undefined,
    validationSchema:
      configurationOptions && userProvidedSourcesAndTargets
        ? buildSchema(
            configurationOptions,
            userProvidedSourcesAndTargets.sources,
            userProvidedSourcesAndTargets.targets
          )
        : undefined,
    onSubmit: handleOnSubmit,
    initialErrors: !project ? { name: "" } : {},
  });

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push(
      formatPath(getPathFromStep(newStep), {
        project: match.params.project,
      })
    );
  };

  const handleOnNext = () => {
    formik.submitForm();
  };

  const handleOnBack = () => {
    history.push(
      formatPath(getPathFromStep(NewProjectWizardStepIds.CUSTOM_LABELS), {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const currentStep = NewProjectWizardStepIds.ADVANCED_OPTIONS;
  const disableNav =
    isFetchingProject ||
    isFetchingRulesProjectScope ||
    isFetchingRulesGlobalScope ||
    configurationOptionsFetchStatus === "inProgress" ||
    formik.isSubmitting ||
    formik.isValidating;
  const canJumpUpto =
    !formik.isValid || formik.dirty
      ? currentStep
      : getMaxAllowedStepToJumpTo(project, analysisContext);

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
      showErrorContent={
        fetchProjectError ||
        fetchRulesErrorProjectScope ||
        fetchRulesErrorGlobalScope ||
        configurationOptionsFetchError
      }
      onGoToStep={handleOnGoToStep}
    >
      <ConditionalRender
        when={
          isFetchingProject ||
          isFetchingRulesProjectScope ||
          isFetchingRulesGlobalScope ||
          configurationOptionsFetchStatus === "inProgress"
        }
        then={<LoadingWizardContent />}
      >
        <Form onSubmit={formik.handleSubmit}>
          {formik.initialValues && configurationOptions && (
            <AdvancedOptionsForm
              configurationOptions={configurationOptions}
              customSources={userProvidedSourcesAndTargets?.sources}
              customTargets={userProvidedSourcesAndTargets?.targets}
              {...formik}
            />
          )}
        </Form>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
