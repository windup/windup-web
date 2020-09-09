import React, { useEffect, useState } from "react";
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

import { AddApplicationsForm } from "components";

import { MigrationProject, Application } from "models/api";
import {
  getProjectById,
  pathTargetType,
  registerApplicationInDirectoryByPath,
  registerApplicationByPath,
} from "api/api";

import { Paths, formatPath } from "Paths";

import NewProjectWizard from "../";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";

interface AddApplicationsProps
  extends RouteComponentProps<{ project: string }> {}

export const AddApplications: React.FC<AddApplicationsProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = useState<MigrationProject>();

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
  const [enableNext, setEnableNext] = useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const [isFetching, setIsFetching] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string>();

  useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data }) => {
        setProject(data);
      })
      .catch(() => {
        setFetchError("Error while fetching migrationProject");
      })
      .finally(() => {
        setIsFetching(false);
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
      setFormValue(value);
      setEnableNext(isValid);
    },
    []
  );

  const handleOnNextStep = () => {
    // Execute serverPath registration only of second tab is selected
    if (formValue && formValue.activeTabKey === 1) {
      setIsSubmitting(true);

      pathTargetType(formValue.tab1?.serverPath!)
        .then(({ data }) => {
          let registerServerPathPromise: AxiosPromise<Application>;

          if (data === "DIRECTORY" && !formValue.tab1?.isServerPathExploded) {
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

          return registerServerPathPromise;
        })
        .then(() => {
          push(
            formatPath(Paths.newProject_setTransformationPath, {
              project: project!.id,
            })
          );
        })
        .catch((error) => {
          setIsSubmitting(false);
          setSubmitError(
            error?.response?.data?.message
              ? error.response.data.message
              : "It was not possible to register the path due to an error."
          );
        });
    } else {
      push(
        formatPath(Paths.newProject_setTransformationPath, {
          project: project!.id,
        })
      );
    }
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.ADD_APPLICATIONS}
      enableNext={enableNext}
      disableNavigation={isFetching || isSubmitting}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      showErrorContent={fetchError}
    >
      {isFetching ? (
        <LoadingWizardContent />
      ) : (
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Add applications
            </Title>
          </StackItem>
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
      )}
    </NewProjectWizard>
  );
};
