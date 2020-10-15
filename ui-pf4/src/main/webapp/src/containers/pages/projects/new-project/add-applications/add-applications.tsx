import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError, AxiosPromise } from "axios";
import { Stack, StackItem, Title, TitleSizes } from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { AddApplicationsTabs, ConditionalRender } from "components";
import {
  AddApplicationsFormValue,
  AddApplicationsTabKey,
} from "components/add-applications-tabs/add-applications-tabs";
import { useFetchProject } from "hooks/useFetchProject";

import { getAlertModel } from "Constants";
import { Paths, formatPath, ProjectRoute } from "Paths";
import { Application } from "models/api";
import {
  pathTargetType,
  registerApplicationInDirectoryByPath,
  registerApplicationByPath,
} from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

import NewProjectWizard from "../wizard";
import { WizardStepIds, LoadingWizardContent } from "../wizard";

interface AddApplicationsProps extends RouteComponentProps<ProjectRoute> {}

export const AddApplications: React.FC<AddApplicationsProps> = ({
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

  const [formValue, setFormValue] = useState<AddApplicationsFormValue>();

  const [enableNext, setEnableNext] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  const handleOnFormChange = useCallback(
    (value: AddApplicationsFormValue, isValid: boolean) => {
      setFormValue(value);
      setEnableNext(isValid);
    },
    []
  );

  const redirectToNextStep = () => {
    push(
      formatPath(Paths.newProject_setTransformationPath, {
        project: match.params.project,
      })
    );
  };

  const handleOnNextStep = () => {
    // Execute serverPath registration only of second tab is selected
    if (
      formValue &&
      formValue.activeTabKey === AddApplicationsTabKey.SERVER_PATH
    ) {
      onSubmit();
    } else {
      redirectToNextStep();
    }
  };

  const onSubmit = () => {
    if (!formValue || !project) {
      return;
    }

    setIsSubmitting(true);
    pathTargetType(formValue.tabServerPath?.serverPath!)
      .then(({ data }) => {
        let registerServerPathPromise: AxiosPromise<Application>;

        if (data === "DIRECTORY" && !formValue.tabServerPath?.isExploded) {
          registerServerPathPromise = registerApplicationInDirectoryByPath(
            project.id,
            formValue.tabServerPath?.serverPath!
          );
        } else {
          registerServerPathPromise = registerApplicationByPath(
            project.id,
            formValue.tabServerPath?.serverPath!,
            formValue.tabServerPath?.isExploded!
          );
        }

        return registerServerPathPromise;
      })
      .then(() => {
        redirectToNextStep();
      })
      .catch((error: AxiosError) => {
        setIsSubmitting(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.ADD_APPLICATIONS}
      enableNext={enableNext}
      disableNavigation={isFetching || isSubmitting}
      showErrorContent={fetchError}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      analysisContext={analysisContext}
    >
      <ConditionalRender when={isFetching} then={<LoadingWizardContent />}>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Add applications
            </Title>
          </StackItem>
          <StackItem>
            {project && (
              <AddApplicationsTabs
                projectId={project.id}
                initialValues={{
                  tabUploadFile: {
                    applications: project.applications,
                  },
                  // activeTabKey: formValue?.activeTabKey,
                  // tabUploadFile: {
                  //   applications: formValue?.tabUploadFile?.applications
                  //     ? formValue.tabUploadFile.applications
                  //     : project.applications,
                  // },
                  // tabServerPath: {
                  //   serverPath: formValue?.tabServerPath?.serverPath,
                  //   isServerPathExploded:
                  //     formValue?.tabServerPath?.isServerPathExploded,
                  // },
                }}
                onChange={handleOnFormChange}
              />
            )}
          </StackItem>
        </Stack>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
