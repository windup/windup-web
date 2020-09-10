import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosPromise } from "axios";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  Alert,
  AlertActionCloseButton,
} from "@patternfly/react-core";

import { FormikHelpers } from "formik";

import { Paths, formatPath } from "Paths";
import { ProjectDetailsForm } from "components";
import {
  deleteProvisionalProjects,
  createProject,
  updateProject,
  getProjectById,
} from "api/api";
import { MigrationProject } from "models/api";

import NewProjectWizard from "../";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";

interface CreateProjectProps
  extends RouteComponentProps<{ project?: string }> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history: { push },
}) => {
  const formRef = React.useRef<FormikHelpers<any>>();

  const [project, setProject] = React.useState<MigrationProject>();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const [isFetching, setIsFetching] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string>();

  React.useEffect(() => {
    deleteProvisionalProjects();
  }, []);

  React.useEffect(() => {
    if (match.params.project) {
      getProjectById(match.params.project)
        .then(({ data }) => {
          setProject(data);
        })
        .catch(() => {
          setFetchError("Could not fetch migrationProject data");
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
    }
  }, [match]);

  const handleOnNextStep = () => {
    if (!formRef.current) {
      throw Error("Could not find a reference to form");
    }

    formRef.current.submitForm();
  };

  const handleOnSubmit = (formValue: {
    name: string;
    description?: string;
  }) => {
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
      .catch(() => {
        setSubmitError("Could not create project");
      });
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.DETAILS}
      enableNext={true}
      disableNavigation={isFetching || isSubmitting}
      handleOnNextStep={handleOnNextStep}
      showErrorContent={fetchError}
    >
      {isFetching ? (
        <LoadingWizardContent />
      ) : (
        <Stack hasGutter>
          {submitError && (
            <StackItem>
              <Alert
                isLiveRegion
                variant="danger"
                title="Error"
                actionClose={
                  <AlertActionCloseButton onClose={() => setSubmitError("")} />
                }
              >
                {submitError}
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Project details
            </Title>
          </StackItem>
          <StackItem>
            <ProjectDetailsForm
              formRef={formRef}
              hideFormControls
              project={project}
              onSubmit={handleOnSubmit}
            />
          </StackItem>
        </Stack>
      )}
    </NewProjectWizard>
  );
};