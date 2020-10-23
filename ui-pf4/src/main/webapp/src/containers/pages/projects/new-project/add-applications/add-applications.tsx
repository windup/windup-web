import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import { AxiosError, AxiosPromise } from "axios";

import {
  Button,
  ButtonVariant,
  Divider,
  Form,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import {
  ConditionalRender,
  AddApplicationsTabs,
  AddApplicationsServerPathForm,
  AddApplicationsServerPathFormSchema,
  AddApplicationsServerPathFormSchemaInitialValues,
  AddApplicationsUploadFilesForm,
  AddApplicationsUploadFilesFormSchema,
  AddApplicationsUploadFilesFormInitialValues,
  AddApplicationsTabsType,
  AddApplicationsList,
} from "components";
import { AddApplicationsServerPathFormValues } from "components/add-applications-form/add-applications-serverpath-form";

import { useFetchProject } from "hooks/useFetchProject";

import { getAlertModel } from "Constants";
import { formatPath, Paths, ProjectRoute } from "Paths";
import { Application } from "models/api";
import {
  pathTargetType,
  registerApplicationByPath,
  registerApplicationInDirectoryByPath,
} from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

import NewProjectWizard, {
  WizardStepIds,
  LoadingWizardContent,
  useWizardCancelRedirect,
} from "../wizard";

interface AddApplicationsProps extends RouteComponentProps<ProjectRoute> {}

export const AddApplications: React.FC<AddApplicationsProps> = ({
  match,
  history: { push },
}) => {
  const [selectedTab, setSelectedTab] = useState(
    AddApplicationsTabsType.UPLOAD_FILE
  );

  const dispatch = useDispatch();
  const redirectOnCancel = useWizardCancelRedirect();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    loadProject,
  } = useFetchProject();

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  const handleUploadFilesFormikSubmit = () => {
    redirectToNextStep();
  };

  const handleServerPathFormikSubmit = (
    values: AddApplicationsServerPathFormValues,
    { setSubmitting }: FormikHelpers<AddApplicationsServerPathFormValues>
  ) => {
    pathTargetType(values.serverPath)
      .then(({ data }) => {
        let registerServerPathPromise: AxiosPromise<Application>;

        if (data === "DIRECTORY" && !values.isExploded) {
          registerServerPathPromise = registerApplicationInDirectoryByPath(
            match.params.project,
            values.serverPath
          );
        } else {
          registerServerPathPromise = registerApplicationByPath(
            match.params.project,
            values.serverPath,
            values.isExploded
          );
        }

        return registerServerPathPromise;
      })
      .then(() => {
        redirectToNextStep();
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

  const uploadFilesFormik = useFormik({
    enableReinitialize: true,
    initialValues: AddApplicationsUploadFilesFormInitialValues(project),
    validationSchema: AddApplicationsUploadFilesFormSchema(true),
    onSubmit: handleUploadFilesFormikSubmit,
    initialErrors:
      project && project.applications.length > 0 ? {} : { applications: "" },
  });

  const serverPathFormik = useFormik({
    initialValues: AddApplicationsServerPathFormSchemaInitialValues(),
    validationSchema: AddApplicationsServerPathFormSchema(),
    onSubmit: handleServerPathFormikSubmit,
    initialErrors: { serverPath: "" },
  });

  const handleOnTabChange = (selected: AddApplicationsTabsType) => {
    setSelectedTab(selected);
    if (selected === AddApplicationsTabsType.SERVER_PATH) {
      serverPathFormik.resetForm();
    }
    // Do not resest uploadPathFormik since it holds the list of applications
  };

  const handleOnDeleteApplication = (applications: Application[]) => {
    uploadFilesFormik.setFieldValue("applications", applications);
  };

  const handleOnNextStep = () => {
    if (selectedTab === AddApplicationsTabsType.UPLOAD_FILE) {
      uploadFilesFormik.submitForm();
    } else {
      serverPathFormik.submitForm();
    }
  };

  const redirectToNextStep = () => {
    push(
      formatPath(Paths.newProject_setTransformationPath, {
        project: match.params.project,
      })
    );
  };

  const handleOnBack = () => {
    push(
      formatPath(Paths.newProject_details, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = useCallback(() => {
    redirectOnCancel(push, project);
  }, [project, push, redirectOnCancel]);

  const buildFooter = (formikConfig: any) => {
    return (
      <footer className={css(styles.wizardFooter)}>
        <Button
          type="button"
          variant={ButtonVariant.primary}
          isDisabled={
            formikConfig.isSubmitting ||
            formikConfig.isValidating ||
            !formikConfig.isValid
          }
          onClick={handleOnNextStep}
        >
          Next
        </Button>
        <Button
          type="button"
          variant={ButtonVariant.secondary}
          isDisabled={formikConfig.isSubmitting || formikConfig.isValidating}
          onClick={handleOnBack}
        >
          Back
        </Button>
        <Button
          type="button"
          variant={ButtonVariant.link}
          isDisabled={formikConfig.isSubmitting || formikConfig.isValidating}
          onClick={handleOnCancel}
        >
          Cancel
        </Button>
      </footer>
    );
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.ADD_APPLICATIONS}
      disableNavigation={false}
      showErrorContent={fetchError}
      migrationProject={project}
      analysisContext={analysisContext}
      footer={
        selectedTab === AddApplicationsTabsType.UPLOAD_FILE
          ? buildFooter(uploadFilesFormik)
          : buildFooter(serverPathFormik)
      }
    >
      <ConditionalRender when={isFetching} then={<LoadingWizardContent />}>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Add applications
            </Title>
          </StackItem>
          <StackItem>
            <AddApplicationsTabs
              value={selectedTab}
              onChange={handleOnTabChange}
              uploadTabContent={
                <Form onSubmit={uploadFilesFormik.handleSubmit}>
                  {project && (
                    <AddApplicationsUploadFilesForm
                      projectId={project.id}
                      {...uploadFilesFormik}
                    />
                  )}
                </Form>
              }
              serverPathTabContent={
                <Form onSubmit={serverPathFormik.handleSubmit}>
                  <AddApplicationsServerPathForm {...serverPathFormik} />
                </Form>
              }
            />
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
          <StackItem>
            <AddApplicationsList
              applications={uploadFilesFormik.values.applications}
              onApplicationDeleted={handleOnDeleteApplication}
            />
          </StackItem>
        </Stack>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
