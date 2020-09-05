import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PageSection,
  WizardStep,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from "@patternfly/react-core";

import { SimplePageSection } from "components";

import { MigrationProject } from "models/api";
import { getProjectById } from "api/api";

import { Paths, formatPath } from "Paths";

import { TITLE, DESCRIPTION } from "../shared/constants";
import {
  LoadingWizard,
  buildWizard,
  WizardStepIds,
} from "../shared/WizardUtils";

interface AddApplicationsProps
  extends RouteComponentProps<{ project: string }> {}

export const AddApplications: React.FC<AddApplicationsProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = useState<MigrationProject>();
  const [isProjectBeingFetched, setIsProjectBeingFetched] = useState(true);

  useEffect(() => {
    getProjectById(match.params.project).then(({ data }) => {
      setProject(data);
      setIsProjectBeingFetched(false);
    });
  }, [match]);

  const handleOnNextStep = () => {};

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
          <StackItem>add application</StackItem>
        </Stack>
      ),
      canJumpTo: true,
      enableNext: false,
    };
  };

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        {isProjectBeingFetched ? (
          <LoadingWizard />
        ) : (
          buildWizard(WizardStepIds.ADD_APPLICATIONS, createWizardStep(), {
            onNext: handleOnNextStep,
            onClose: handleOnClose,
            onGoToStep: handleOnGoToStep,
            onBack: handleOnGoToStep,
          })
        )}
      </PageSection>
    </React.Fragment>
  );
};
