import React, { useCallback, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError } from "axios";

import { Formik, FormikHelpers } from "formik";
import { Button, ButtonVariant } from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

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
import { getAxiosErrorMessage } from "utils/modelUtils";

import NewProjectWizard, {
  WizardStepIds,
  LoadingWizardContent,
  useWizardCancelRedirect,
} from "../wizard";

interface SetAdvancedOptionsProps extends RouteComponentProps<ProjectRoute> {}

export const SetAdvancedOptions: React.FC<SetAdvancedOptionsProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

  const redirectOnCancel = useWizardCancelRedirect();

  /**
   * Fetch organization and analysisContext
   */

  const {
    project,
    analysisContext,
    isFetching: isFetchingProject,
    fetchError: fetchProjectError,
    loadProject,
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
  const isFetchingConfigurationOptions =
    useSelector((state: RootState) => {
      return configurationOptionSelector.status(state);
    }) === "inProgress";
  const fetchConfigurationOptionsError = useSelector((state: RootState) =>
    configurationOptionSelector.error(state)
  );

  useEffect(() => {
    if (!configurationOptions) {
      dispatch(configurationOptionActions.fetchConfigurationOptions());
    }
  }, [configurationOptions, dispatch]);

  /**
   * Handlers
   */

  const handleOnNextStep = (
    formValues: any,
    formikHelpers: FormikHelpers<any>
  ) => {
    handleOnSubmit(formValues, formikHelpers);
  };

  const handleOnBackStep = () => {
    push(
      formatPath(Paths.newProject_customLabels, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = useCallback(() => {
    redirectOnCancel(push, project);
  }, [project, push, redirectOnCancel]);

  //

  const handleOnSubmit = (
    formValues: any,
    { setSubmitting }: FormikHelpers<any>
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
        push(
          formatPath(Paths.newProject_review, {
            project: project.id,
          })
        );
      })
      .catch((error: AxiosError) => {
        setSubmitting(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  const stepId = WizardStepIds.ADVANCED_OPTIONS;

  if (!analysisContext || !configurationOptions) {
    return (
      <NewProjectWizard
        stepId={stepId}
        enableNext={true}
        disableNavigation={true}
      >
        <LoadingWizardContent />
      </NewProjectWizard>
    );
  }

  return (
    <Formik
      validateOnMount
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={buildInitialValues(analysisContext, configurationOptions)}
      validationSchema={buildSchema(configurationOptions)}
      onSubmit={handleOnNextStep}
    >
      {({ isValid, isValidating, isSubmitting, handleSubmit, ...formik }) => {
        const loading = isFetchingProject || isFetchingConfigurationOptions;
        const disableNavigation = loading || isSubmitting || isValidating;

        return (
          <form
            onSubmit={handleSubmit}
            className="pf-l-stack pf-l-stack__item pf-m-fill"
          >
            <NewProjectWizard
              stepId={stepId}
              enableNext={true}
              disableNavigation={disableNavigation}
              showErrorContent={
                fetchProjectError || fetchConfigurationOptionsError
              }
              migrationProject={project}
              analysisContext={analysisContext}
              footer={
                <footer className={css(styles.wizardFooter)}>
                  <Button
                    variant={ButtonVariant.primary}
                    type="submit"
                    isDisabled={disableNavigation || !isValid}
                  >
                    Next
                  </Button>
                  <Button
                    variant={ButtonVariant.secondary}
                    onClick={handleOnBackStep}
                    isDisabled={disableNavigation}
                  >
                    Back
                  </Button>
                  <Button
                    variant={ButtonVariant.link}
                    onClick={handleOnCancel}
                    isDisabled={disableNavigation}
                  >
                    Cancel
                  </Button>
                </footer>
              }
            >
              <ConditionalRender when={loading} then={<LoadingWizardContent />}>
                <>
                  {configurationOptions && (
                    <AdvancedOptionsForm
                      configurationOptions={configurationOptions}
                      {...{
                        ...formik,
                        isValidating,
                        isSubmitting,
                        handleSubmit,
                      }}
                    />
                  )}
                </>
              </ConditionalRender>
            </NewProjectWizard>
          </form>
        );
      }}
    </Formik>
  );
};
