import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError } from "axios";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Button,
  ButtonVariant,
  List,
  ListItem,
} from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { ConditionalRender } from "components";
import { useFetchProject } from "hooks/useFetchProject";
import { useFetchRules } from "hooks/useFetchRules";
import { useFetchLabels } from "hooks/useFetchLabels";

import { AdvancedOptionsFieldKey, getAlertModel } from "Constants";
import { formatPath, Paths, ProjectRoute } from "Paths";
import {
  getAnalysisContext,
  createProjectExecution,
  saveAnalysisContext,
} from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";
import { AnalysisContext } from "models/api";

import { useCancelWizard } from "../wizard/useCancelWizard";
import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import { getPathFromStep } from "../wizard/wizard-utils";
import { LoadingWizardContent } from "../wizard/loading-content";

const NONE = (
  <span className="pf-c-content">
    <i>
      <small>none</small>
    </i>
  </span>
);

const nullabeContent = (value: any) => {
  return value ? value : NONE;
};

const getAdvancedOptionsWithExclusion = (
  analysisContext: AnalysisContext,
  exclude: AdvancedOptionsFieldKey[]
) => {
  return analysisContext.advancedOptions.filter(
    (f) => !exclude.some((e) => e === f.name)
  );
};

interface ReviewProps extends RouteComponentProps<ProjectRoute> {}

export const Review: React.FC<ReviewProps> = ({ match, history }) => {
  const dispatch = useDispatch();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject: loadProject,
  } = useFetchProject();

  const {
    rulesPath,
    isFetching: isFetchingRules,
    fetchError: fetchRulesError,
    loadRules,
  } = useFetchRules();
  const {
    labelsPath,
    isFetching: isFetchingLabels,
    fetchError: fetchLabelsError,
    loadLabels,
  } = useFetchLabels();

  const [isCreatingExecution, setIsCreatingExecution] = useState(false);

  const redirectOnCancel = useCancelWizard();

  useEffect(() => {
    loadProject(match.params.project);
    loadRules(match.params.project);
    loadLabels(match.params.project);
  }, [match, loadProject, loadRules, loadLabels]);

  const handleSaveAndRun = (createExecution: boolean) => {
    setIsCreatingExecution(true);
    if (project) {
      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          return saveAnalysisContext(project.id, data, false);
        })
        .then(({ data }) => {
          if (createExecution) {
            return createProjectExecution(project.id, data);
          }
        })
        .then(() => {
          if (createExecution) {
            history.push(
              formatPath(Paths.executions, {
                project: project.id,
              })
            );
          } else {
            history.push(Paths.projects);
          }
        })
        .catch((error: AxiosError) => {
          setIsCreatingExecution(false);
          dispatch(
            alertActions.alert(
              getAlertModel("danger", "Error", getAxiosErrorMessage(error))
            )
          );
        });
    }
  };

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push(
      formatPath(getPathFromStep(newStep), {
        project: match.params.project,
      })
    );
  };

  const handleOnBackStep = () => {
    history.push(
      formatPath(Paths.newProject_advandedOptions, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = () => redirectOnCancel(history.push);

  const currentStep = NewProjectWizardStepIds.REVIEW;
  const disableNav =
    isFetching || isFetchingRules || isFetchingLabels || isCreatingExecution;
  const canJumpUpto = currentStep;

  return (
    <NewProjectWizard
      disableNav={disableNav}
      stepId={currentStep}
      canJumpUpTo={canJumpUpto}
      showErrorContent={fetchError || fetchRulesError || fetchLabelsError}
      onGoToStep={handleOnGoToStep}
      footer={
        <footer className={css(styles.wizardFooter)}>
          <Button
            variant={ButtonVariant.primary}
            onClick={() => handleSaveAndRun(false)}
            isDisabled={disableNav}
          >
            Save
          </Button>
          <Button
            variant={ButtonVariant.primary}
            type="submit"
            onClick={() => handleSaveAndRun(true)}
            isDisabled={disableNav}
          >
            Save and run
          </Button>
          <Button
            variant={ButtonVariant.secondary}
            onClick={handleOnBackStep}
            isDisabled={disableNav}
          >
            Back
          </Button>
          <Button
            variant={ButtonVariant.link}
            onClick={handleOnCancel}
            isDisabled={disableNav}
          >
            Cancel
          </Button>
        </footer>
      }
    >
      <ConditionalRender
        when={isFetching || isFetchingRules || isFetchingLabels}
        then={<LoadingWizardContent />}
      >
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Review project details
              </Title>
              <Text component="small">
                Review the information below, then save your project or save
                your project and run the analysis.
              </Text>
            </TextContent>
          </StackItem>
          {project && analysisContext && rulesPath && labelsPath && (
            <StackItem>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Project name</DescriptionListTerm>
                  <DescriptionListDescription>
                    {project.title}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>
                    {nullabeContent(project.description)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Applications</DescriptionListTerm>
                  <DescriptionListDescription>
                    <List>
                      {project.applications.map((item, index) => (
                        <ListItem key={index}>{item.inputFilename}</ListItem>
                      ))}
                    </List>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Target</DescriptionListTerm>
                  <DescriptionListDescription>
                    {analysisContext.advancedOptions
                      .filter((f) => f.name === AdvancedOptionsFieldKey.TARGET)
                      .map((f) => f.value)
                      .join(", ")}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Included packages</DescriptionListTerm>
                  <DescriptionListDescription>
                    {analysisContext.includePackages.length === 0 ? (
                      "No packages defined. Default configuration will be applied."
                    ) : (
                      <List>
                        {analysisContext.includePackages.map((elem, index) => (
                          <ListItem key={index}>{elem.fullName}</ListItem>
                        ))}
                      </List>
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Custom rules</DescriptionListTerm>
                  <DescriptionListDescription>
                    {rulesPath.length > 0 ? (
                      <List>
                        {rulesPath.map((elem, index) => (
                          <ListItem key={index}>
                            {elem.shortPath || elem.path}{" "}
                            {!!analysisContext.rulesPaths.find(
                              (f) => f.id === elem.id
                            )
                              ? "(Enabled)"
                              : "(Disabled)"}
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      NONE
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Custom labels</DescriptionListTerm>
                  <DescriptionListDescription>
                    {labelsPath.length > 0 ? (
                      <List>
                        {labelsPath.map((elem, index) => (
                          <ListItem key={index}>
                            {elem.shortPath || elem.path}{" "}
                            {!!analysisContext.labelsPaths.find(
                              (f) => f.id === elem.id
                            )
                              ? "(Enabled)"
                              : "(Disabled)"}
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      NONE
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Advanced options</DescriptionListTerm>
                  <DescriptionListDescription>
                    {getAdvancedOptionsWithExclusion(analysisContext, [
                      AdvancedOptionsFieldKey.TARGET,
                    ]).length > 0 ? (
                      <table
                        role="grid"
                        className="pf-c-table pf-m-grid-md pf-m-compact"
                        aria-label="Advanced options table"
                      >
                        <thead>
                          <tr role="row">
                            <th role="columnheader" scope="col">
                              Option
                            </th>
                            <th role="columnheader" scope="col">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getAdvancedOptionsWithExclusion(analysisContext, [
                            AdvancedOptionsFieldKey.TARGET,
                          ]).map((option, index) => (
                            <tr key={index} role="row">
                              <td role="cell">{option.name}</td>
                              <td role="cell">{option.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      NONE
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </StackItem>
          )}
        </Stack>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
