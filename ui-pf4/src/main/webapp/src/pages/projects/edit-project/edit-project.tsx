import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
import { AxiosError } from "axios";

import {
  ActionGroup,
  Bullseye,
  Button,
  ButtonVariant,
  Form,
  Grid,
  GridItem,
  PageSection,
} from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import {
  AppPlaceholder,
  ConditionalRender,
  ProjectDetailsForm,
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
  SimplePageSection,
  FetchErrorEmptyState,
} from "components";
import { ProjectDetailsFormValues } from "components/project-details-form/project-details-form";

import { getAlertModel } from "Constants";
import { Paths, ProjectRoute } from "Paths";
import { MigrationProject } from "models/api";
import { getProjectById, updateProject } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

export interface ApplicationListProps
  extends RouteComponentProps<ProjectRoute> {}

export const EditProject: React.FC<ApplicationListProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

  const [project, setProject] = useState<MigrationProject>();
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const redirectToProjectsPage = useCallback(() => {
    push(Paths.projects);
  }, [push]);

  useEffect(() => {
    if (match.params.project) {
      getProjectById(match.params.project)
        .then(({ data }) => {
          setProject(data);

          setIsFetching(false);
          setFetchError("");
        })
        .catch((error: AxiosError) => {
          setIsFetching(false);
          setFetchError(error.message);
        });
    } else {
      redirectToProjectsPage();
    }
  }, [match, dispatch, redirectToProjectsPage]);

  const handleOnSubmit = (
    formValue: ProjectDetailsFormValues,
    { setSubmitting }: FormikHelpers<ProjectDetailsFormValues>
  ) => {
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
        setSubmitting(false);
        redirectToProjectsPage();
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

  return (
    <>
      <SimplePageSection title="Project details" />
      <PageSection variant="light">
        <ConditionalRender when={isFetching} then={<AppPlaceholder />}>
          {fetchError ? (
            <Bullseye>
              <FetchErrorEmptyState />
            </Bullseye>
          ) : (
            <Grid lg={12}>
              <GridItem lg={8}>
                <Formik
                  initialValues={projectDetailsFormInitialValue(project)}
                  validationSchema={projectDetailsFormSchema(project)}
                  onSubmit={handleOnSubmit}
                  initialErrors={{ name: "" }}
                  validateOnBlur={false}
                >
                  {({
                    isValid,
                    isValidating,
                    isSubmitting,
                    handleSubmit,
                    ...formik
                  }) => {
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
                            isDisabled={
                              isSubmitting || isValidating || !isValid
                            }
                          >
                            Save
                          </Button>
                          <Button
                            variant={ButtonVariant.link}
                            onClick={redirectToProjectsPage}
                            isDisabled={isSubmitting || isValidating}
                          >
                            Cancel
                          </Button>
                        </ActionGroup>
                      </Form>
                    );
                  }}
                </Formik>
              </GridItem>
            </Grid>
          )}
        </ConditionalRender>
      </PageSection>
    </>
  );
};
