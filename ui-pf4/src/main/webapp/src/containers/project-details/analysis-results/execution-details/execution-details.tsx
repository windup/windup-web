import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { PageSection, Label } from "@patternfly/react-core";

import { Paths, formatPath } from "Paths";
import { getExecution } from "api/api";
import { WindupExecution } from "models/api";

import {
  PageHeader,
  mapStateToLabel,
  mapStateToIcon,
  AppPlaceholder,
} from "components";

import { ProjectStatusWatcher } from "containers/project-details/project-status-watcher";

const Overview = lazy(() => import("./overview"));
const Rules = lazy(() => import("./rules"));
const Logs = lazy(() => import("./logs"));

export interface ExecutionDetailsProps
  extends RouteComponentProps<{ project: string; execution: string }> {}

export const ExecutionDetails: React.FC<ExecutionDetailsProps> = ({
  match,
}) => {
  const [execution, setExecution] = React.useState<WindupExecution>();

  React.useEffect(() => {
    getExecution(match.params.execution).then(({ data: executionData }) => {
      setExecution(executionData);
    });
  }, [match]);

  return (
    <React.Fragment>
      {execution && (
        <PageHeader
          title={`Analysis #${execution.id}`}
          resourceStatus={
            <ProjectStatusWatcher watch={execution}>
              {({ execution: watchedExecution }) => (
                <Label icon={mapStateToIcon(watchedExecution.state)}>
                  {mapStateToLabel(watchedExecution.state)}
                </Label>
              )}
            </ProjectStatusWatcher>
          }
          breadcrumbs={[
            {
              title: "Executions",
              path: formatPath(Paths.editProject_executionList, {
                project: match.params.project,
              }),
            },
            {
              title: "Details",
              path: formatPath(Paths.editProject_executionDetails, {
                project: match.params.project,
                execution: match.params.execution,
              }),
            },
          ]}
          menuActions={[{ label: "Delete", callback: () => {} }]}
          navItems={[
            {
              title: "Details",
              path: formatPath(Paths.editProject_executionDetails_overview, {
                project: match.params.project,
                execution: match.params.execution,
              }),
            },
            {
              title: "Applications",
              path: formatPath(
                Paths.editProject_executionDetails_applications,
                {
                  project: match.params.project,
                  execution: match.params.execution,
                }
              ),
            },
            {
              title: "Rules",
              path: formatPath(Paths.editProject_executionDetails_rules, {
                project: match.params.project,
                execution: match.params.execution,
              }),
            },
            {
              title: "Logs",
              path: formatPath(Paths.editProject_executionDetails_logs, {
                project: match.params.project,
                execution: match.params.execution,
              }),
            },
          ]}
        />
      )}
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route
              path={Paths.editProject_executionDetails_overview}
              component={Overview}
            />
            <Route
              path={Paths.editProject_executionDetails_rules}
              component={Rules}
            />
            <Route
              path={Paths.editProject_executionDetails_logs}
              component={Logs}
            />
          </Switch>
        </Suspense>
      </PageSection>
    </React.Fragment>
  );
};
