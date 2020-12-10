import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import { AxiosError, AxiosPromise } from "axios";

import {
  Divider,
  Form,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from "@patternfly/react-core";

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
import { AddApplicationsUploadFilesFormValues } from "components/add-applications-form/add-applications-uploadfiles-form";
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

import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import { useCancelWizard } from "../wizard/useCancelWizard";
import { WizardFooter } from "../wizard/project-wizard-footer";
import { LoadingWizardContent } from "../wizard/loading-content";
import {
  getMaxAllowedStepToJumpTo,
  getPathFromStep,
} from "../wizard/wizard-utils";

interface AddApplicationsProps extends RouteComponentProps<ProjectRoute> {}

export const AddApplications: React.FC<AddApplicationsProps> = ({
  match,
  history,
}) => {
  const [selectedTab, setSelectedTab] = useState(
    AddApplicationsTabsType.UPLOAD_FILE
  );

  const dispatch = useDispatch();
  const cancelWizard = useCancelWizard();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject: loadProject,
  } = useFetchProject();

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  const handleUploadFilesFormikSubmit = (
    values: AddApplicationsUploadFilesFormValues,
    formikHelpers: FormikHelpers<AddApplicationsUploadFilesFormValues>
  ) => {
    history.push(
      formatPath(Paths.newProject_setTransformationPath, {
        project: match.params.project,
      })
    );
  };

  const handleServerPathFormikSubmit = (
    values: AddApplicationsServerPathFormValues,
    formikHelpers: FormikHelpers<AddApplicationsServerPathFormValues>
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
        formikHelpers.setSubmitting(false);
        history.push(
          formatPath(Paths.newProject_setTransformationPath, {
            project: match.params.project,
          })
        );
      })
      .catch((error: AxiosError) => {
        formikHelpers.setSubmitting(false);
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
  };

  const handleOnDeleteApplication = (applications: Application[]) => {
    uploadFilesFormik.setFieldValue("applications", applications);
  };

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push(
      formatPath(getPathFromStep(newStep), {
        project: match.params.project,
      })
    );
  };

  const handleOnNext = () => {
    if (selectedTab === AddApplicationsTabsType.UPLOAD_FILE) {
      uploadFilesFormik.submitForm();
    } else if (selectedTab === AddApplicationsTabsType.SERVER_PATH) {
      serverPathFormik.submitForm();
    } else {
      throw new Error("Invalid selected tab:" + selectedTab);
    }
  };

  const handleOnBack = () => {
    history.push(
      formatPath(Paths.newProject_details, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const currentStep = NewProjectWizardStepIds.ADD_APPLICATIONS;
  const formik =
    selectedTab === AddApplicationsTabsType.UPLOAD_FILE
      ? uploadFilesFormik
      : serverPathFormik;
  const disableNav = isFetching || formik.isSubmitting || formik.isValidating;
  const canJumpUpto =
    !formik.isValid || formik.dirty
      ? currentStep
      : getMaxAllowedStepToJumpTo(project, analysisContext);

  const footer = (
    <WizardFooter
      isDisabled={disableNav}
      isNextDisabled={disableNav || !formik.isValid}
      onNext={handleOnNext}
      onBack={handleOnBack}
      onCancel={handleOnCancel}
    />
  );

  return (
    <NewProjectWizard
      disableNav={disableNav}
      stepId={currentStep}
      canJumpUpTo={canJumpUpto}
      footer={footer}
      showErrorContent={fetchError}
      onGoToStep={handleOnGoToStep}
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
