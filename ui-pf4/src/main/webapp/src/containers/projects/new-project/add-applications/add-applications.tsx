import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosPromise } from "axios";
import {
  PageSection,
  WizardStep,
  Stack,
  StackItem,
  Title,
  TitleSizes,
  Alert,
  AlertActionCloseButton,
} from "@patternfly/react-core";

import { SimplePageSection, AddApplicationsForm } from "components";

import { MigrationProject, Application } from "models/api";
import {
  getProjectById,
  pathTargetType,
  registerApplicationInDirectoryByPath,
  registerApplicationByPath,
} from "api/api";

import { Paths, formatPath } from "Paths";

import { TITLE, DESCRIPTION } from "../shared/constants";
import {
  LoadingWizard,
  buildWizard,
  WizardStepIds,
  ErrorWizard,
} from "../shared/WizardUtils";

interface AddApplicationsProps
  extends RouteComponentProps<{ project: string }> {}

export const AddApplications: React.FC<AddApplicationsProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = useState<MigrationProject>();
  const [isProjectBeingFetched, setIsProjectBeingFetched] = useState(true);

  const [enableNext, setEnableNext] = useState(false);
  const [formValue, setFormValue] = useState<{
    activeTabKey?: number;
    tab0?: {
      applications: Application[];
    };
    tab1?: {
      serverPath?: string;
      isServerPathExploded?: boolean;
    };
  }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWizardError, setShowWizardError] = useState(false);

  const [
    serverPathRegistrationErrorMsg,
    setServerPathRegistrationErrorMsg,
  ] = useState<string>();

  useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data }) => {
        setProject(data);
        setIsProjectBeingFetched(false);
        setEnableNext(data.applications.length > 0);
      })
      .catch(() => {
        setIsProjectBeingFetched(false);
        setShowWizardError(true);
      });
  }, [match]);

  const handleOnFormChange = React.useCallback(
    (
      value: {
        activeTabKey?: number;
        tab0?: {
          applications: Application[];
        };
        tab1?: {
          serverPath?: string;
          isServerPathExploded?: boolean;
        };
      },
      isValid: boolean
    ) => {
      if (isValid) {
        setFormValue(value);
      }

      setEnableNext(isValid);
    },
    []
  );

  const handleOnNextStep = () => {
    // Execute serverPath registration only of second tab is selected
    if (formValue && formValue.activeTabKey === 1) {
      setIsSubmitting(true);

      pathTargetType(formValue.tab1?.serverPath!)
        .then(({ data: data1 }) => {
          let registerServerPathPromise: AxiosPromise<Application>;

          if (data1 === "DIRECTORY" && !formValue.tab1?.isServerPathExploded) {
            registerServerPathPromise = registerApplicationInDirectoryByPath(
              project!.id,
              formValue.tab1?.serverPath!
            );
          } else {
            registerServerPathPromise = registerApplicationByPath(
              project!.id,
              formValue.tab1?.serverPath!,
              formValue.tab1?.isServerPathExploded!
            );
          }

          registerServerPathPromise
            .then(() => {
              push(
                formatPath(Paths.newProject_setTransformationPath, {
                  project: project!.id,
                })
              );
            })
            .catch((error) => {
              setServerPathRegistrationErrorMsg(
                error?.response?.data?.message
                  ? error.response.data.message
                  : "It was not possible to register the path due to an error."
              );
              setIsSubmitting(false);
            });
        })
        .catch(() => {
          setShowWizardError(true);
        });
    } else {
      push(
        formatPath(Paths.newProject_setTransformationPath, {
          project: project!.id,
        })
      );
    }
  };

  const handleOnClose = () => {
    push(Paths.projects);
  };

  const handleOnGoToStep = (newStep: { id?: number }) => {
    switch (newStep.id) {
      case WizardStepIds.DETAILS:
        push(
          formatPath(Paths.newProject_details, {
            project: project?.id,
          })
        );
        break;
      case WizardStepIds.SET_TRANSFORMATION_PATH:
        push(
          formatPath(Paths.newProject_setTransformationPath, {
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
      id: WizardStepIds.ADD_APPLICATIONS,
      name: "Add applications",
      component: (
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Add applications
            </Title>
          </StackItem>
          {serverPathRegistrationErrorMsg && (
            <StackItem>
              <Alert
                isLiveRegion
                variant="danger"
                title="Server path registration error"
                actionClose={
                  <AlertActionCloseButton
                    onClose={() => setServerPathRegistrationErrorMsg(undefined)}
                  />
                }
              >
                {serverPathRegistrationErrorMsg}
              </Alert>
            </StackItem>
          )}
          <StackItem>
            {project && (
              <AddApplicationsForm
                projectId={project.id}
                initialValues={{
                  activeTabKey: formValue?.activeTabKey,
                  tab0: {
                    applications: formValue?.tab0?.applications
                      ? formValue.tab0.applications
                      : project.applications,
                  },
                  tab1: {
                    serverPath: formValue?.tab1?.serverPath,
                    isServerPathExploded: formValue?.tab1?.isServerPathExploded,
                  },
                }}
                onChange={handleOnFormChange}
              />
            )}
          </StackItem>
        </Stack>
      ),
      canJumpTo: true,
      enableNext: enableNext,
    };
  };

  if (showWizardError) {
    return <ErrorWizard onClose={handleOnClose} />;
  }

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        {isSubmitting || isProjectBeingFetched ? (
          <LoadingWizard />
        ) : (
          buildWizard(
            WizardStepIds.ADD_APPLICATIONS,
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
