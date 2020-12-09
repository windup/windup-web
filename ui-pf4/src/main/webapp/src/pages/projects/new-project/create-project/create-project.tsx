import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError, AxiosPromise } from "axios";
import { FormikHelpers, useFormik } from "formik";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  Form,
} from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import {
  ConditionalRender,
  ProjectDetailsForm,
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
} from "components";
import { ProjectDetailsFormValues } from "components/project-details-form/project-details-form";
import { useFetchProject } from "hooks/useFetchProject";

import { getAlertModel } from "Constants";
import { formatPath, OptionalProjectRoute } from "Paths";

import {
  deleteProvisionalProjects,
  createProject,
  updateProject,
} from "api/api";
import { MigrationProject } from "models/api";
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

interface FormValues extends ProjectDetailsFormValues {
  nextStep: NewProjectWizardStepIds;
}

interface CreateProjectProps
  extends RouteComponentProps<OptionalProjectRoute> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history,
}) => {
  const dispatch = useDispatch();
  const cancelWizard = useCancelWizard();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject,
  } = useFetchProject();

  useEffect(() => {
    deleteProvisionalProjects();

    if (match.params.project) {
      fetchProject(match.params.project);
    }
  }, [match, fetchProject]);

  const fireOnSubmit = (nextStep: NewProjectWizardStepIds) => {
    formik.setFieldValue("nextStep", nextStep);
    formik.submitForm();
  };

  const handleOnSubmit = (
    formValue: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const body: MigrationProject = {
      ...project,
      title: formValue.name.trim(),
      description: formValue.description,
    } as MigrationProject;

    let promise: AxiosPromise<MigrationProject>;
    if (!project) {
      promise = createProject(body);
    } else {
      promise = updateProject(body);
    }

    promise
      .then(({ data }) => {
        formikHelpers.setSubmitting(false);
        history.push(
          formatPath(getPathFromStep(formValue.nextStep), {
            project: data.id,
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...projectDetailsFormInitialValue(project),
      nextStep: NewProjectWizardStepIds.DETAILS,
    },
    validationSchema: projectDetailsFormSchema(project),
    onSubmit: handleOnSubmit,
    initialErrors: !project ? { name: "" } : {},
  });

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    if (formik.dirty) {
      fireOnSubmit(newStep);
    } else {
      history.push(
        formatPath(getPathFromStep(newStep), {
          project: match.params.project,
        })
      );
    }
  };

  const handleOnNext = () => {
    fireOnSubmit(NewProjectWizardStepIds.ADD_APPLICATIONS);
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const currentStep = NewProjectWizardStepIds.DETAILS;
  const disableNav = isFetching || formik.isSubmitting || formik.isValidating;
  const canJumpUpto = formik.isValid
    ? getMaxAllowedStepToJumpTo(project, analysisContext)
    : currentStep;

  const footer = (
    <WizardFooter
      hideBackButton
      isDisabled={disableNav}
      isNextDisabled={disableNav || !formik.isValid}
      onNext={handleOnNext}
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
        <Form onSubmit={formik.handleSubmit}>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Project details
              </Title>
            </StackItem>
            <StackItem>
              <ProjectDetailsForm {...formik} />
            </StackItem>
          </Stack>
        </Form>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
