import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PageSection,
  Stack,
  StackItem,
  Title,
  TitleSizes,
  WizardStep,
} from "@patternfly/react-core";

import { SimplePageSection, ProjectDetailsForm } from "components";
import {
  deleteProvisionalProjects,
  createProject,
  updateProject,
  getProjectById,
} from "api/api";

import { Paths, formatPath } from "Paths";

import { TITLE, DESCRIPTION } from "../shared/constants";
import {
  LoadingWizard,
  buildWizard,
  WizardStepIds,
  ErrorWizard,
} from "../shared/WizardUtils";
import { MigrationProject } from "models/api";
import { AxiosPromise } from "axios";

interface CreateProjectProps
  extends RouteComponentProps<{ project?: string }> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history: { push },
}) => {
  const [enableNext, setEnableNext] = useState(false);
  const [formValue, setFormValue] = useState<{
    name?: string;
    description?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [project, setProject] = useState<MigrationProject>();
  const [isProjectBeingFetched, setIsProjectBeingFetched] = useState(true);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    deleteProvisionalProjects();
  }, []);

  useEffect(() => {
    if (match.params.project) {
      getProjectById(match.params.project)
        .then(({ data }) => {
          setProject(data);
          setIsProjectBeingFetched(false);
        })
        .catch(() => {
          setShowError(true);
        });
    } else {
      setIsProjectBeingFetched(false);
    }
  }, [match]);

  const handleOnFormChange = (
    value: { name?: string; description?: string },
    isValid: boolean
  ) => {
    if (isValid) {
      setFormValue(value);
    }

    setEnableNext(isValid);
  };

  const handleOnNextStep = () => {
    setIsSubmitting(true);

    let body: MigrationProject = {
      title: formValue.name,
      description: formValue.description,
    } as MigrationProject;

    let promise: AxiosPromise<MigrationProject>;
    if (!project) {
      promise = createProject(body);
    } else {
      body = { ...project, ...body };
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
        setShowError(true);
      });
  };

  const handleOnClose = () => {
    push(Paths.projects);
  };

  const handleOnGoToStep = (newStep: { id?: number }) => {
    switch (newStep.id) {
      case WizardStepIds.DETAILS:
        break;
      case WizardStepIds.ADD_APPLICATIONS:
        push(
          formatPath(Paths.newProject_addApplications, {
            project: project?.id,
          })
        );
        break;
      default:
        new Error("Can not go to step id[" + newStep.id + "]");
    }
  };

  const createWizardStep = (): WizardStep => {
    return {
      id: WizardStepIds.DETAILS,
      name: "Details",
      component: (
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Project details
            </Title>
          </StackItem>
          <StackItem>
            <ProjectDetailsForm
              hideFormControls
              initialValues={{
                name: project?.title,
                description: project?.description,
              }}
              onChange={handleOnFormChange}
            />
          </StackItem>
        </Stack>
      ),
      canJumpTo: true,
      enableNext: enableNext,
    };
  };

  if (showError) {
    return <ErrorWizard />;
  }

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        {isSubmitting || isProjectBeingFetched ? (
          <LoadingWizard />
        ) : (
          buildWizard(
            WizardStepIds.DETAILS,
            createWizardStep(),
            {
              onNext: handleOnNextStep,
              onClose: handleOnClose,
              onGoToStep: handleOnGoToStep,
              onBack: handleOnGoToStep,
            },
            project
          )
        )}
      </PageSection>
    </React.Fragment>
  );
};
