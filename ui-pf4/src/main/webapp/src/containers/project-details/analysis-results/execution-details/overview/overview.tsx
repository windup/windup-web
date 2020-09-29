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
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

import { getExecution } from "api/api";
import { WindupExecution } from "models/api";

import { getWindupStaticReportsBase } from "Constants";
import { RulesLabelsList } from "components";

import { ProjectStatusWatcher } from "containers/project-status-watcher";

export interface OverviewProps
  extends RouteComponentProps<{ project: string; execution: string }> {}

export const Overview: React.FC<OverviewProps> = ({ match }) => {
  const [execution, setExecution] = React.useState<WindupExecution>();

  React.useEffect(() => {
    getExecution(match.params.execution).then(({ data: executionData }) => {
      setExecution(executionData);
    });
  }, [match]);

  return (
    <React.Fragment>
      {execution && (
        <Stack hasGutter>
          <StackItem>
            <Card>
              <CardTitle>Status</CardTitle>
              <CardBody>
                <DescriptionList
                  columnModifier={{
                    default: "2Col",
                  }}
                >
                  <DescriptionListGroup>
                    <DescriptionListTerm>Started</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ProjectStatusWatcher watch={execution}>
                        {({ execution: watchedExecution }) =>
                          watchedExecution.timeStarted ? (
                            <Moment>{watchedExecution.timeCompleted}</Moment>
                          ) : (
                            "Not yet"
                          )
                        }
                      </ProjectStatusWatcher>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Duration</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ProjectStatusWatcher watch={execution}>
                        {({ execution: watchedExecution }) =>
                          watchedExecution.timeStarted ? (
                            <Moment
                              date={watchedExecution.timeCompleted}
                              duration={watchedExecution.timeStarted}
                            />
                          ) : (
                            "Waiting to finish"
                          )
                        }
                      </ProjectStatusWatcher>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Report</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ProjectStatusWatcher watch={execution}>
                        {({ execution: watchedExecution }) =>
                          watchedExecution.state === "COMPLETED" ? (
                            <a
                              title="Reports"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`${getWindupStaticReportsBase()}/${
                                execution.applicationListRelativePath
                              }`}
                            >
                              Open report <ExternalLinkAltIcon />
                            </a>
                          ) : (
                            "Not available"
                          )
                        }
                      </ProjectStatusWatcher>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Grid hasGutter md={6}>
              <GridItem>
                <Card>
                  <CardTitle>Applications</CardTitle>
                  <CardBody>
                    <List>
                      {execution.analysisContext.applications.map(
                        (item, index) => (
                          <ListItem key={index}>{item.inputFilename}</ListItem>
                        )
                      )}
                    </List>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardTitle>Included packages</CardTitle>
                  <CardBody>
                    <List>
                      {execution.analysisContext.includePackages.map(
                        (item, index) => (
                          <ListItem key={index}>{item.fullName}</ListItem>
                        )
                      )}
                    </List>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem>
            <Card>
              <CardTitle>Custom rules</CardTitle>
              <CardBody>
                <RulesLabelsList
                  items={execution.analysisContext.rulesPaths.map((f) => ({
                    label: f.shortPath || f.path,
                    type: f.rulesPathType,
                    scope: f.scopeType,
                  }))}
                />
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card>
              <CardTitle>Custom labels</CardTitle>
              <CardBody>
                <RulesLabelsList
                  items={execution.analysisContext.labelsPaths.map((f) => ({
                    label: f.shortPath || f.path,
                    type: f.labelsPathType,
                    scope: f.scopeType,
                  }))}
                />
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      )}
    </React.Fragment>
  );
};
