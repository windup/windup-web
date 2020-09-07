import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PageSection,
  Stack,
  StackItem,
  Title,
  TitleSizes,
  WizardStep,
  TextContent,
  Text,
} from "@patternfly/react-core";

import { SimplePageSection } from "components";

import { TITLE, DESCRIPTION } from "../shared/constants";
import { buildWizard, WizardStepIds } from "../shared/WizardUtils";

interface CustomLabelsProps extends RouteComponentProps<{ project: string }> {}

export const CustomLabels: React.FC<CustomLabelsProps> = () => {
  const handleOnNextStep = () => {};

  const handleOnClose = () => {};

  const handleOnGoToStep = () => {};

  const createWizardStep = (): WizardStep => {
    return {
      id: WizardStepIds.CUSTOM_LABELS,
      name: "Custom labels",
      component: (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Custom labels
              </Title>
              <Text component="small">
                Upload the labels you want yo include in the analysis
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>Not implemented yet</StackItem>
        </Stack>
      ),
      canJumpTo: true,
      enableNext: true,
    };
  };

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        {buildWizard(WizardStepIds.CUSTOM_LABELS, createWizardStep(), {
          onNext: handleOnNextStep,
          onClose: handleOnClose,
          onGoToStep: handleOnGoToStep,
          onBack: handleOnGoToStep,
        })}
      </PageSection>
    </React.Fragment>
  );
};
