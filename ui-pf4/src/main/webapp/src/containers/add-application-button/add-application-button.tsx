import React, { useState } from "react";
import { AxiosError, AxiosPromise } from "axios";
import { FormikHelpers, useFormik } from "formik";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  Modal,
  ModalVariant,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import {
  AddApplicationsList,
  AddApplicationsServerPathForm,
  AddApplicationsServerPathFormSchema,
  AddApplicationsServerPathFormSchemaInitialValues,
  AddApplicationsTabs,
  AddApplicationsTabsType,
  AddApplicationsUploadFilesForm,
  AddApplicationsUploadFilesFormInitialValues,
  AddApplicationsUploadFilesFormSchema,
} from "components";
import { AddApplicationsServerPathFormValues } from "components/add-applications-form/add-applications-serverpath-form";

import { getAlertModel } from "Constants";
import { getAxiosErrorMessage } from "utils/modelUtils";
import { Application } from "models/api";
import {
  pathTargetType,
  registerApplicationByPath,
  registerApplicationInDirectoryByPath,
} from "api/api";
import { AddApplicationsUploadFilesFormValues } from "components/add-applications-form/add-applications-uploadfiles-form";

export interface AddApplicationButtonProps {
  projectId: string | number;
  onModalClose: () => void;
}

export const AddApplicationButton: React.FC<AddApplicationButtonProps> = ({
  projectId,
  onModalClose,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTab, setSelectedTab] = useState(
    AddApplicationsTabsType.UPLOAD_FILE
  );

  const handleOnModalToggle = () => {
    if (isModalOpen) {
      onModalClose();
      uploadFilesFormik.resetForm();
      serverPathFormik.resetForm();
    }

    setIsModalOpen((current) => !current);
  };

  const handleUploadFilesFormikSubmit = (
    values: AddApplicationsUploadFilesFormValues,
    { setSubmitting }: FormikHelpers<AddApplicationsUploadFilesFormValues>
  ) => {
    setSubmitting(false);
    handleOnModalToggle();
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
            projectId,
            values.serverPath
          );
        } else {
          registerServerPathPromise = registerApplicationByPath(
            projectId,
            values.serverPath,
            values.isExploded
          );
        }

        return registerServerPathPromise;
      })
      .then(() => {
        handleOnModalToggle();
      })
      .catch((error: AxiosError) => {
        setSubmitting(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
        handleOnModalToggle();
      });
  };

  const uploadFilesFormik = useFormik({
    initialValues: AddApplicationsUploadFilesFormInitialValues(),
    validationSchema: AddApplicationsUploadFilesFormSchema(false),
    onSubmit: handleUploadFilesFormikSubmit,
    // initialErrors: { applications: "" },
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

  const buildActions = () => {
    if (selectedTab === AddApplicationsTabsType.UPLOAD_FILE) {
      return [
        <Button
          key="save-upload"
          type="button"
          variant={ButtonVariant.primary}
          isDisabled={
            uploadFilesFormik.isSubmitting ||
            uploadFilesFormik.isValidating ||
            !uploadFilesFormik.isValid
          }
          onClick={() => uploadFilesFormik.submitForm()}
        >
          Close
        </Button>,
      ];
    } else {
      return [
        <Button
          key="save-serverpath"
          type="button"
          variant={ButtonVariant.primary}
          isDisabled={
            serverPathFormik.isSubmitting ||
            serverPathFormik.isValidating ||
            !serverPathFormik.isValid
          }
          onClick={() => serverPathFormik.submitForm()}
        >
          Save
        </Button>,
        <Button
          key="cancel-serverpth"
          type="button"
          variant={ButtonVariant.link}
          isDisabled={
            serverPathFormik.isSubmitting || serverPathFormik.isValidating
          }
          onClick={() => handleOnModalToggle()}
        >
          Cancel
        </Button>,
      ];
    }
  };

  return (
    <>
      <Button type="button" onClick={handleOnModalToggle}>
        Add application
      </Button>
      <Modal
        variant={ModalVariant.medium}
        title={`Add application`}
        isOpen={isModalOpen}
        onClose={handleOnModalToggle}
      >
        <Stack hasGutter>
          <StackItem>
            <AddApplicationsTabs
              value={selectedTab}
              onChange={handleOnTabChange}
              uploadTabContent={
                <Form onSubmit={uploadFilesFormik.handleSubmit}>
                  <AddApplicationsUploadFilesForm
                    projectId={projectId}
                    {...uploadFilesFormik}
                  />
                  <AddApplicationsList
                    applications={uploadFilesFormik.values.applications}
                    onApplicationDeleted={handleOnDeleteApplication}
                  />
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
            <Form>
              <ActionGroup>{buildActions()}</ActionGroup>
            </Form>
          </StackItem>
        </Stack>
      </Modal>
    </>
  );
};
