import React, { useCallback, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError, AxiosPromise } from "axios";
import { Formik, FormikHelpers } from "formik";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  Button,
  ButtonVariant,
  Form,
} from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import {
  ProjectDetailsForm,
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
} from "components";
import { ProjectDetailsFormValues } from "components/project-details-form/project-details-form";

import { useFetchProject } from "hooks/useFetchProject";

import { getAlertModel } from "Constants";
import { Paths, formatPath, OptionalProjectRoute } from "Paths";

import {
  deleteProvisionalProjects,
  createProject,
  updateProject,
} from "api/api";
import { MigrationProject } from "models/api";

import NewProjectWizard, {
  WizardStepIds,
  LoadingWizardContent,
} from "../wizard";

interface CreateProjectProps
  extends RouteComponentProps<OptionalProjectRoute> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();
  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    loadProject,
  } = useFetchProject();

  useEffect(() => {
    deleteProvisionalProjects();

    if (match.params.project) {
      loadProject(match.params.project);
    }
  }, [match, loadProject]);

  const handleOnNextStep = (
    values: ProjectDetailsFormValues,
    formikHelpers: FormikHelpers<ProjectDetailsFormValues>
  ) => {
    handleOnSubmit(values, formikHelpers);
  };

  const handleOnSubmit = (
    formValue: ProjectDetailsFormValues,
    { setSubmitting }: FormikHelpers<ProjectDetailsFormValues>
  ) => {
    const body: MigrationProject = {
      ...project,
      title: formValue.name.trim(),
      description: formValue.description,
    } as MigrationProject;

    let promise: AxiosPromise<MigrationProject>;
    if (!project) {
      promise = createProject(body);
    } else {
      promise = updateProject(body);
    }

    promise
      .then(({ data }) => {
        setSubmitting(false);
        push(
          formatPath(Paths.newProject_addApplications, {
            project: data.id,
          })
        );
      })
      .catch((error: AxiosError) => {
        setSubmitting(false);
        dispatch(
          alertActions.alert(getAlertModel("danger", "Error", error.message))
        );
      });
  };

  const handleOnCancel = useCallback(() => {
    push(Paths.projects);
  }, [push]);

  const stepId = WizardStepIds.DETAILS;

  if (isFetching) {
    return (
      <NewProjectWizard
        stepId={stepId}
        enableNext={false}
        disableNavigation={true}
      >
        <LoadingWizardContent />
      </NewProjectWizard>
    );
  }

  return (
    <Formik
      initialValues={projectDetailsFormInitialValue(project)}
      validationSchema={projectDetailsFormSchema(project)}
      onSubmit={handleOnNextStep}
      initialErrors={!project ? { name: "" } : {}} // Form initial isValid value
    >
      {({ isValid, isValidating, isSubmitting, handleSubmit, ...formik }) => {
        const disableNavigation = isSubmitting || isValidating;

        return (
          <Form
            onSubmit={handleSubmit}
            className="pf-l-stack pf-l-stack__item pf-m-fill"
          >
            <NewProjectWizard
              stepId={stepId}
              disableNavigation={disableNavigation}
              showErrorContent={fetchError}
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
                    variant={ButtonVariant.link}
                    onClick={handleOnCancel}
                    isDisabled={disableNavigation}
                  >
                    Cancel
                  </Button>
                </footer>
              }
            >
              <Stack hasGutter>
                <StackItem>
                  <Title headingLevel="h5" size={TitleSizes["lg"]}>
                    Project details
                  </Title>
                </StackItem>
                <StackItem>
                  <ProjectDetailsForm
                    {...{ ...formik, isValidating, isSubmitting, handleSubmit }}
                  />
                </StackItem>
              </Stack>
            </NewProjectWizard>
          </Form>
        );
      }}
    </Formik>
  );
};
