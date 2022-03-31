import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import { AxiosError } from "axios";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  Form,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import {
  AdvancedOptionsForm,
  AppPlaceholder,
  ConditionalRender,
  FetchErrorEmptyState,
  SelectProjectEmptyMessage,
} from "components";
import { useFetchProject } from "hooks/useFetchProject";

import {
  buildSchema,
  buildInitialValues,
} from "components/advanced-options-form/schema";

import { formatPath, Paths, ProjectRoute } from "Paths";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import {
  configurationOptionSelector,
  configurationOptionActions,
} from "store/configurationOptions";
import { alertActions } from "store/alert";

import {
  createProjectExecution,
  getAnalysisContext,
  getAnalysisContextCustomTechnologies,
  saveAnalysisContext,
} from "api/api";
import {
  AdvancedOption,
  AnalysisContext,
  SourceTargetTechnologies,
} from "models/api";

import { getAlertModel } from "Constants";
import { isNullOrUndefined } from "utils/utils";
import { getAxiosErrorMessage } from "utils/modelUtils";

const SUBMIT_BUTTON = "submitButton";
const SAVE = "save";
const SAVE_AND_EXECUTE = "save and execute";

export interface AdvancedOptionsProps
  extends RouteComponentProps<ProjectRoute> {}

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (!isNullOrUndefined(match.params.project)) {
      loadProject(match.params.project);
    }
  }, [match, loadProject]);

  /**
   * Fetch windup configurationOptions
   */

  const configurationOptions = useSelector((state: RootState) =>
    configurationOptionSelector.configurationOptions(state)
  );
  const fetchConfigurationOptionsStatus = useSelector((state: RootState) =>
    configurationOptionSelector.status(state)
  );
  const fetchConfigurationOptionsError = useSelector((state: RootState) =>
    configurationOptionSelector.error(state)
  );

  useEffect(() => {
    if (!configurationOptions) {
      dispatch(configurationOptionActions.fetchConfigurationOptions());
    }
  }, [configurationOptions, dispatch]);

  /**
   * Fetch Analysis Context custom technologies
   */
  const [customTechnologies, setCustomTechnologies] = useState<
    SourceTargetTechnologies
  >();

  const [
    isFechingCustomTechnologies,
    setIsFechingCustomTechnologies,
  ] = useState(false);

  useEffect(() => {
    if (analysisContext) {
      setIsFechingCustomTechnologies(true);
      getAnalysisContextCustomTechnologies(analysisContext.id)
        .then(({ data }) => {
          setCustomTechnologies(data);
        })
        .finally(() => {
          setIsFechingCustomTechnologies(false);
        });
    }
  }, [analysisContext]);

  //

  const onCancel = () => {
    push(
      formatPath(Paths.executions, {
        project: match.params.project,
      })
    );
  };

  //
  const handleOnSubmit = (
    formValues: any,
    { setSubmitting }: FormikHelpers<any>,
    runAnalysis: boolean
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

        return saveAnalysisContext(project.id, body, false);
      })
      .then(({ data }) => {
        if (runAnalysis) {
          return createProjectExecution(project.id, data);
        }
      })
      .then(() => {
        if (runAnalysis) {
          push(
            formatPath(Paths.executions, {
              project: match.params.project,
            })
          );
        } else {
          setSubmitting(false);
        }
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

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: false,
    validateOnBlur: false,
    initialValues:
      analysisContext && configurationOptions
        ? {
            [SUBMIT_BUTTON]: "",
            ...buildInitialValues(analysisContext, configurationOptions),
          }
        : undefined,
    validationSchema:
      configurationOptions && customTechnologies
        ? buildSchema(configurationOptions, customTechnologies)
        : undefined,
    onSubmit: (values, formikHelpers) => {
      const { submitButton, ...formValues } = values;
      handleOnSubmit(
        formValues,
        formikHelpers,
        submitButton === SAVE_AND_EXECUTE
      );
    },
    initialErrors: !project ? { name: "" } : {},
  });

  const isFetching =
    isFetchingProject ||
    fetchConfigurationOptionsStatus === "inProgress" ||
    isFechingCustomTechnologies;
  const fetchError = fetchProjectError || fetchConfigurationOptionsError;

  const arePrimaryButtonsDisabled =
    isFetching ||
    !formik.isValid ||
    !formik.dirty ||
    formik.isValidating ||
    formik.isSubmitting;

  if (fetchError) {
    return (
      <Card>
        <CardBody>
          <FetchErrorEmptyState />
        </CardBody>
      </Card>
    );
  }

  return (
    <ConditionalRender
      when={isNullOrUndefined(match.params.project)}
      then={<SelectProjectEmptyMessage />}
    >
      <ConditionalRender when={isFetching} then={<AppPlaceholder />}>
        <Form onSubmit={formik.handleSubmit}>
          <Stack>
            {formik.initialValues &&
              configurationOptions &&
              customTechnologies && (
                <StackItem>
                  <Card>
                    <CardBody>
                      <AdvancedOptionsForm
                        configurationOptions={configurationOptions}
                        customTechnologies={customTechnologies}
                        {...formik}
                      />
                    </CardBody>
                  </Card>
                </StackItem>
              )}
            {!fetchError && (
              <StackItem>
                <ActionGroup>
                  <Button
                    type="submit"
                    onClick={() => formik.setFieldValue(SUBMIT_BUTTON, SAVE)}
                    variant={ButtonVariant.primary}
                    isDisabled={arePrimaryButtonsDisabled}
                  >
                    Save
                  </Button>
                  <Button
                    type="submit"
                    onClick={() =>
                      formik.setFieldValue(SUBMIT_BUTTON, SAVE_AND_EXECUTE)
                    }
                    variant={ButtonVariant.primary}
                    isDisabled={arePrimaryButtonsDisabled}
                  >
                    Save and run
                  </Button>
                  <Button variant={ButtonVariant.link} onClick={onCancel}>
                    Cancel
                  </Button>
                </ActionGroup>
              </StackItem>
            )}
          </Stack>
        </Form>
      </ConditionalRender>
    </ConditionalRender>
  );
};
