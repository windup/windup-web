import React from "react";
import { AxiosError } from "axios";
import { Formik, FormikHelpers } from "formik";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import {
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
} from "components";
import {
  ProjectDetailsForm,
  ProjectDetailsFormValues,
} from "components/project-details-form/project-details-form";

import { getAlertModel } from "Constants";
import { MigrationProject } from "models/api";
import { getProjectById, updateProject } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

interface EditProjectModalProps {
  project: MigrationProject;
  onClose: (refresh: boolean) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  onClose,
}) => {
  const dispatch = useDispatch();

  const handleOnSubmit = (
    formValue: ProjectDetailsFormValues,
    { setSubmitting }: FormikHelpers<ProjectDetailsFormValues>
  ) => {
    getProjectById(project.id)
      .then(({ data }) => {
        const body: MigrationProject = {
          ...data,
          title: formValue.name.trim(),
          description: formValue.description,
        } as MigrationProject;
        return updateProject(body);
      })
      .then(() => {
        setSubmitting(false);
        onClose(true);
      })
      .catch((error: AxiosError) => {
        setSubmitting(false);
        onClose(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title="Project details"
      isOpen={true}
      onClose={() => onClose(false)}
    >
      <Formik
        initialValues={projectDetailsFormInitialValue(project)}
        validationSchema={projectDetailsFormSchema(project)}
        onSubmit={handleOnSubmit}
        initialErrors={{ name: "" }}
      >
        {({ isValid, isValidating, isSubmitting, handleSubmit, ...formik }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ProjectDetailsForm
                {...{
                  ...formik,
                  isValidating,
                  isSubmitting,
                  handleSubmit,
                }}
              />
              <ActionGroup>
                <Button
                  type="submit"
                  variant={ButtonVariant.primary}
                  isDisabled={isSubmitting || isValidating || !isValid}
                >
                  Save
                </Button>
                <Button
                  variant={ButtonVariant.link}
                  onClick={() => onClose(false)}
                  isDisabled={isSubmitting || isValidating}
                >
                  Cancel
                </Button>
              </ActionGroup>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
