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
import { Paths } from "Paths";

import { TITLE, DESCRIPTION } from "../shared/constants";
import { buildWizard, WizardStepIds } from "../shared/WizardUtils";

interface CustomRulesProps extends RouteComponentProps<{ project: string }> {}

export const CustomRules: React.FC<CustomRulesProps> = ({
  history: { push },
}) => {
  const handleOnNextStep = () => {};

  const handleOnClose = () => {
    push(Paths.projects);
  };

  const handleOnGoToStep = () => {};

  const createWizardStep = (): WizardStep => {
    return {
      id: WizardStepIds.CUSTOM_RULES,
      name: "Custom rules",
      component: (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Custom rules
              </Title>
              <Text component="small">
                Upload the rules you want yo include in the analysis
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>Not implemented yet</StackItem>
        </Stack>
      ),
      canJumpTo: false,
      enableNext: false,
    };
  };

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        {buildWizard(WizardStepIds.CUSTOM_RULES, createWizardStep(), {
          onNext: handleOnNextStep,
          onClose: handleOnClose,
          onGoToStep: handleOnGoToStep,
          onBack: handleOnGoToStep,
        })}
      </PageSection>
    </React.Fragment>
  );
};
