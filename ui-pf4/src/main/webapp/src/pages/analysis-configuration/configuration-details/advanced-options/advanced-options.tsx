import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
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
  saveAnalysisContext,
} from "api/api";
import { AdvancedOption, AnalysisContext } from "models/api";

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

  return (
    <ConditionalRender
      when={isNullOrUndefined(match.params.project)}
      then={<SelectProjectEmptyMessage />}
    >
      {isFetchingProject || fetchConfigurationOptionsStatus === "inProgress" ? (
        <AppPlaceholder />
      ) : fetchProjectError || fetchConfigurationOptionsError ? (
        <Card>
          <CardBody>
            <FetchErrorEmptyState />
          </CardBody>
        </Card>
      ) : (
        <>
          {analysisContext && configurationOptions && (
            <Formik
              validateOnMount
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={{
                [SUBMIT_BUTTON]: "",
                ...buildInitialValues(analysisContext, configurationOptions),
              }}
              validationSchema={buildSchema(configurationOptions)}
              onSubmit={(values, formikHelpers) => {
                const { submitButton, ...formValues } = values;
                handleOnSubmit(
                  formValues,
                  formikHelpers,
                  submitButton === SAVE_AND_EXECUTE
                );
              }}
            >
              {({
                isValidating,
                isSubmitting,
                submitForm,
                handleSubmit,
                setFieldValue,
                ...formik
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Stack>
                    <StackItem>
                      <Card>
                        <CardBody>
                          <AdvancedOptionsForm
                            configurationOptions={configurationOptions}
                            {...{
                              ...formik,
                              isValidating,
                              isSubmitting,
                              submitForm,
                              handleSubmit,
                              setFieldValue,
                            }}
                          />
                        </CardBody>
                      </Card>
                    </StackItem>
                    {!fetchProjectError && !fetchConfigurationOptionsError && (
                      <StackItem>
                        <ActionGroup>
                          <Button
                            type="submit"
                            onClick={() => setFieldValue(SUBMIT_BUTTON, SAVE)}
                            variant={ButtonVariant.primary}
                            isDisabled={isSubmitting || isValidating}
                          >
                            Save
                          </Button>
                          <Button
                            type="submit"
                            onClick={() =>
                              setFieldValue(SUBMIT_BUTTON, SAVE_AND_EXECUTE)
                            }
                            variant={ButtonVariant.primary}
                            isDisabled={isSubmitting || isValidating}
                          >
                            Save and run
                          </Button>
                          <Button
                            variant={ButtonVariant.link}
                            onClick={onCancel}
                          >
                            Cancel
                          </Button>
                        </ActionGroup>
                      </StackItem>
                    )}
                  </Stack>
                </Form>
              )}
            </Formik>
          )}
        </>
      )}
    </ConditionalRender>
  );
};
