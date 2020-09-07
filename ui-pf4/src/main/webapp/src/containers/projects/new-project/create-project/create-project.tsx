import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosPromise } from "axios";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  AlertActionLink,
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

  const [processing, setProcessing] = React.useState(true);
  const [error, setError] = React.useState<string>();

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
          setError("Could not fetch migrationProject data");
        })
        .finally(() => {
          setProcessing(false);
        });
    } else {
      setProcessing(false);
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
    setProcessing(true);

    const body: MigrationProject = {
      ...project,
      title: formValue.name,
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
        setError("Could not create project");
      });
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.DETAILS}
      enableNext={true}
      isDisabled={processing}
      handleOnNextStep={handleOnNextStep}
      error={error}
      errorLink={
        <AlertActionLink onClick={() => window.location.reload()}>
          Reload page
        </AlertActionLink>
      }
      onErrorClose={() => setError("")}
    >
      {processing ? (
        <LoadingWizardContent />
      ) : (
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Project details
            </Title>
          </StackItem>
          <StackItem>
            <ProjectDetailsForm
              formRef={formRef}
              hideFormControls
              initialValues={{
                name: project?.title || "",
                description: project?.description || "",
              }}
              onSubmit={handleOnSubmit}
            />
          </StackItem>
        </Stack>
      )}
    </NewProjectWizard>
  );
};
