import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Moment from "react-moment";

import {
  Card,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Stack,
  StackItem,
  Grid,
  GridItem,
  List,
  ListItem,
} from "@patternfly/react-core";
import { ChartBarIcon, DownloadIcon } from "@patternfly/react-icons";

import {
  AdvancedOptionsFieldKey,
  getWindupStaticReportsBase,
  MERGED_CSV_FILENAME,
} from "Constants";
import {
  ExecutionStatusWithTime,
  ExpandableCard,
  mapStateToLabel,
  RulesLabelsList,
} from "components";

import { ProjectStatusWatcher } from "containers/project-status-watcher";
import { ProjectExecutionRoute } from "Paths";
import { isOptionEnabledInExecution } from "utils/modelUtils";
import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { executionSelectors } from "store/execution";

export interface OverviewProps
  extends RouteComponentProps<ProjectExecutionRoute> {}

export const Overview: React.FC<OverviewProps> = ({ match }) => {
  const execution = useSelector((state: RootState) =>
    executionSelectors.selectExecution(state, Number(match.params.execution))
  );

  return (
    <>
      {execution && (
        <Stack hasGutter>
          <StackItem>
            <Grid hasGutter md={6}>
              <GridItem>
                <Card>
                  <CardTitle>Transformation path</CardTitle>
                  <CardBody>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Target</DescriptionListTerm>
                        <DescriptionListDescription>
                          {execution.analysisContext.advancedOptions
                            .filter(
                              (f) => f.name === AdvancedOptionsFieldKey.TARGET
                            )
                            .map((f) => f.value)
                            .join(", ")}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Source</DescriptionListTerm>
                        <DescriptionListDescription>
                          {execution.analysisContext.advancedOptions
                            .filter(
                              (f) => f.name === AdvancedOptionsFieldKey.SOURCE
                            )
                            .map((f) => f.value)
                            .join(", ") || "Not defined"}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardTitle>Status</CardTitle>
                  <CardBody>
                    <ProjectStatusWatcher watch={execution}>
                      {({ execution: watchedExecution }) => (
                        <DescriptionList
                          columnModifier={{
                            default: "2Col",
                          }}
                        >
                          <DescriptionListGroup>
                            <DescriptionListTerm>Status</DescriptionListTerm>
                            <DescriptionListDescription>
                              {mapStateToLabel(watchedExecution.state)}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Started</DescriptionListTerm>
                            <DescriptionListDescription>
                              {watchedExecution.timeStarted ? (
                                <Moment>{watchedExecution.timeStarted}</Moment>
                              ) : (
                                "Not yet"
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Duration</DescriptionListTerm>
                            <DescriptionListDescription>
                              {watchedExecution.timeStarted ? (
                                <ExecutionStatusWithTime
                                  execution={watchedExecution}
                                  showPrefix={false}
                                />
                              ) : (
                                "Waiting"
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Reports</DescriptionListTerm>
                            <DescriptionListDescription>
                              {watchedExecution.state === "COMPLETED" ? (
                                <Stack>
                                  {!isOptionEnabledInExecution(
                                    execution,
                                    AdvancedOptionsFieldKey.SKIP_REPORTS
                                  ) && (
                                    <StackItem>
                                      <a
                                        title="Reports"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`${getWindupStaticReportsBase()}/${
                                          execution.applicationListRelativePath
                                        }`}
                                      >
                                        <ChartBarIcon /> Reports
                                      </a>
                                    </StackItem>
                                  )}
                                  {isOptionEnabledInExecution(
                                    execution,
                                    AdvancedOptionsFieldKey.EXPORT_CSV
                                  ) && (
                                    <StackItem>
                                      <a
                                        title="Download all issues CSV"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`${getWindupStaticReportsBase()}/${
                                          execution.id
                                        }/${MERGED_CSV_FILENAME}`}
                                      >
                                        <DownloadIcon /> All issues CSV
                                      </a>
                                    </StackItem>
                                  )}
                                </Stack>
                              ) : (
                                "Not available"
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      )}
                    </ProjectStatusWatcher>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem>
            <Grid hasGutter md={6}>
              <GridItem>
                <ExpandableCard title="Applications">
                  <List>
                    {execution.analysisContext.applications.map(
                      (item, index) => (
                        <ListItem key={index}>{item.inputFilename}</ListItem>
                      )
                    )}
                  </List>
                </ExpandableCard>
              </GridItem>
              <GridItem>
                <ExpandableCard title="Included packages" maxHeight={200}>
                  {execution.analysisContext.includePackages.length > 0 && (
                    <List>
                      {execution.analysisContext.includePackages.map(
                        (item, index) => (
                          <ListItem key={index}>{item.fullName}</ListItem>
                        )
                      )}
                    </List>
                  )}
                  {execution.analysisContext.includePackages.length === 0 && (
                    <span>
                      No packages defined. Default configuration will be
                      applied.
                    </span>
                  )}
                </ExpandableCard>
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem>
            <ExpandableCard title="Custom rules">
              <RulesLabelsList
                items={execution.analysisContext.rulesPaths.map((f) => ({
                  label: f.shortPath || f.path,
                  type: f.rulesPathType,
                  scope: f.scopeType,
                }))}
              />
            </ExpandableCard>
          </StackItem>
          <StackItem>
            <ExpandableCard title="Custom labels">
              <RulesLabelsList
                items={execution.analysisContext.labelsPaths.map((f) => ({
                  label: f.shortPath || f.path,
                  type: f.labelsPathType,
                  scope: f.scopeType,
                }))}
              />
            </ExpandableCard>
          </StackItem>
          <StackItem>
            <ExpandableCard title="Advanced options">
              <table
                role="grid"
                className="pf-c-table pf-m-grid-md pf-m-compact"
                aria-label="This is a simple table example"
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
                  {execution.analysisContext.advancedOptions
                    .filter((f) => {
                      return (
                        f.name !== AdvancedOptionsFieldKey.TARGET &&
                        f.name !== AdvancedOptionsFieldKey.SOURCE
                      );
                    })
                    .map((option, index) => (
                      <tr key={index} role="row">
                        <td role="cell">{option.name}</td>
                        <td role="cell">{option.value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </ExpandableCard>
          </StackItem>
        </Stack>
      )}
    </>
  );
};
