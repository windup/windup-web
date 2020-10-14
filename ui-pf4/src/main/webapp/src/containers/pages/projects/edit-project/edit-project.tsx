import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Formik } from "formik";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  Modal,
  ModalVariant,
  PageSection,
} from "@patternfly/react-core";

import {
  AppPlaceholder,
  ConditionalRender,
  ProjectDetailsForm,
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
  SimplePageSection,
} from "components";

import { Paths, ProjectRoute } from "Paths";
import { useDispatch } from "react-redux";
import { MigrationProject } from "models/api";
import { getProjectById, updateProject } from "api/api";
import { AxiosError } from "axios";
import { alertActions } from "store/alert";
import { getAlertModel } from "Constants";
import { ProjectDetailsFormValues } from "components/project-details-form/project-details-form";

export interface ApplicationListProps
  extends RouteComponentProps<ProjectRoute> {}

export const EditProject: React.FC<ApplicationListProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

  const [project, setProject] = useState<MigrationProject>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const handleCloseModal = useCallback(() => {
    push(Paths.projects);
  }, [push]);

  useEffect(() => {
    if (match.params.project) {
      getProjectById(match.params.project)
        .then(({ data }) => {
          setProject(data);
          setIsFetching(false);
        })
        .catch((error: AxiosError) => {
          dispatch(
            alertActions.alert(getAlertModel("danger", "Error", error.message))
          );
          handleCloseModal();
        });
    } else {
      handleCloseModal();
    }
  }, [match, dispatch, handleCloseModal]);

  const handleOnSubmit = (formValue: ProjectDetailsFormValues) => {
    setIsSubmitting(true);

    getProjectById(match.params.project)
      .then(({ data }) => {
        const body: MigrationProject = {
          ...data,
          title: formValue.name.trim(),
          description: formValue.description,
        } as MigrationProject;
        return updateProject(body);
      })
      .then(() => {
        handleCloseModal();
      })
      .catch((error: AxiosError) => {
        dispatch(
          alertActions.alert(getAlertModel("danger", "Error", error.message))
        );
        handleCloseModal();
      });
  };

  return (
    <>
      <SimplePageSection title="Projects" />
      <PageSection>
        <Modal
          variant={ModalVariant.medium}
          title="Edit project"
          isOpen={true}
          onClose={handleCloseModal}
        >
          <ConditionalRender when={isFetching} then={<AppPlaceholder />}>
            <Formik
              initialValues={projectDetailsFormInitialValue(project)}
              validationSchema={projectDetailsFormSchema(project)}
              onSubmit={handleOnSubmit}
            >
              {({ isValidating, handleSubmit, ...formik }) => {
                return (
                  <Form
                    onSubmit={handleSubmit}
                    className="pf-l-stack pf-l-stack__item pf-m-fill"
                  >
                    <ProjectDetailsForm
                      isValidating={isValidating}
                      handleSubmit={handleSubmit}
                      {...formik}
                    />

                    <ActionGroup>
                      <Button
                        type="submit"
                        variant={ButtonVariant.primary}
                        isDisabled={isSubmitting || isValidating}
                      >
                        Save
                      </Button>
                      <Button
                        variant={ButtonVariant.link}
                        onClick={handleCloseModal}
                        isDisabled={isSubmitting || isValidating}
                      >
                        Cancel
                      </Button>
                    </ActionGroup>
                  </Form>
                );
              }}
            </Formik>
          </ConditionalRender>
        </Modal>
      </PageSection>
    </>
  );
};
