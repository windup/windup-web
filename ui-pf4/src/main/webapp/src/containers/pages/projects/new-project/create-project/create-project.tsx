import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError, AxiosPromise } from "axios";
import { Formik } from "formik";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  Button,
  ButtonVariant,
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

import { getAlertModel } from "Constants";
import { Paths, formatPath, OptionalProjectRoute } from "Paths";

import {
  deleteProvisionalProjects,
  createProject,
  updateProject,
  getProjectById,
  getAnalysisContext,
} from "api/api";
import { MigrationProject, AnalysisContext } from "models/api";

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

  const [project, setProject] = useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string>();

  useEffect(() => {
    deleteProvisionalProjects();
  }, []);

  useEffect(() => {
    if (match.params.project) {
      getProjectById(match.params.project)
        .then(({ data }) => {
          setProject(data);
          return getAnalysisContext(data.defaultAnalysisContextId);
        })
        .then(({ data: analysisContextData }) => {
          setAnalysisContext(analysisContextData);
        })
        .catch((error: AxiosError) => {
          setFetchError(error.message);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
    }
  }, [match]);

  const handleOnNextStep = (values: ProjectDetailsFormValues) => {
    handleOnSubmit(values);
  };

  const handleOnSubmit = (formValue: ProjectDetailsFormValues) => {
    setIsSubmitting(true);

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
      .then((project) => {
        push(
          formatPath(Paths.newProject_addApplications, {
            project: project.data.id,
          })
        );
      })
      .catch((error: AxiosError) => {
        dispatch(
          alertActions.alert(getAlertModel("danger", "Error", error.message))
        );
      });
  };

  const handleOnCancel = () => {
    push(Paths.projects);
  };

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
    <>
      <Formik
        initialValues={projectDetailsFormInitialValue(project)}
        validationSchema={projectDetailsFormSchema(project)}
        onSubmit={handleOnNextStep}
      >
        {({ isValidating, handleSubmit, ...formik }) => {
          const disableNavigation = isSubmitting || isValidating;

          return (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="pf-l-stack pf-l-stack__item pf-m-fill"
            >
              <NewProjectWizard
                stepId={stepId}
                enableNext={true}
                disableNavigation={disableNavigation}
                showErrorContent={fetchError}
                migrationProject={project}
                analysisContext={analysisContext}
                footer={
                  <footer className={css(styles.wizardFooter)}>
                    <Button
                      variant={ButtonVariant.primary}
                      type="submit"
                      isDisabled={disableNavigation}
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
                      isValidating={isValidating}
                      handleSubmit={handleSubmit}
                      {...formik}
                    />
                  </StackItem>
                </Stack>
              </NewProjectWizard>
            </form>
          );
        }}
      </Formik>
    </>
  );
};
