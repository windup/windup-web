import React, { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";

import { PageSection, Label } from "@patternfly/react-core";

import { deleteDialogActions } from "store/deleteDialog";

import { Paths, formatPath, ProjectExecutionRoute } from "Paths";
import { deleteExecution, getExecution } from "api/api";
import { WindupExecution } from "models/api";

import {
  PageHeader,
  mapStateToLabel,
  mapStateToIcon,
  AppPlaceholder,
} from "components";

import { ProjectStatusWatcher } from "containers/project-status-watcher";

const Overview = lazy(() => import("./overview"));
const Logs = lazy(() => import("./logs"));

export interface ExecutionDetailsProps
  extends RouteComponentProps<ProjectExecutionRoute> {}

export const ExecutionDetails: React.FC<ExecutionDetailsProps> = ({
  match,
  history: { push },
}) => {
  const [execution, setExecution] = useState<WindupExecution>();

  const dispatch = useDispatch();

  const handleDeleteExecution = () => {
    if (!execution) {
      return;
    }

    dispatch(
      deleteDialogActions.openModal({
        name: `#${execution.id.toString()}`,
        type: "analysis",
        onDelete: () => {
          dispatch(deleteDialogActions.processing);
          deleteExecution(execution.id).then(() => {
            dispatch(deleteDialogActions.closeModal());
            push(
              formatPath(Paths.executions, {
                project: match.params.project,
              })
            );
          });
        },
        onCancel: () => {
          dispatch(deleteDialogActions.closeModal());
        },
      })
    );
  };

  useEffect(() => {
    getExecution(match.params.execution).then(({ data: executionData }) => {
      setExecution(executionData);
    });
  }, [match]);

  return (
    <>
      <PageHeader
        title={`Analysis #${execution?.id}`}
        resourceStatus={
          execution ? (
            <ProjectStatusWatcher watch={execution}>
              {({ execution: watchedExecution }) => (
                <Label icon={mapStateToIcon(watchedExecution.state)}>
                  {mapStateToLabel(watchedExecution.state)}
                </Label>
              )}
            </ProjectStatusWatcher>
          ) : undefined
        }
        breadcrumbs={[
          {
            title: "Executions",
            path: formatPath(Paths.executions, {
              project: match.params.project,
            }),
          },
          {
            title: "Details",
            path: formatPath(Paths.editExecution, {
              project: match.params.project,
              execution: match.params.execution,
            }),
          },
        ]}
        menuActions={[{ label: "Delete", callback: handleDeleteExecution }]}
        navItems={[
          {
            title: "Details",
            path: formatPath(Paths.editExecution_overview, {
              project: match.params.project,
              execution: match.params.execution,
            }),
          },
          {
            title: "Logs",
            path: formatPath(Paths.editExecution_logs, {
              project: match.params.project,
              execution: match.params.execution,
            }),
          },
        ]}
      />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route path={Paths.editExecution_overview} component={Overview} />
            <Route path={Paths.editExecution_logs} component={Logs} />
          </Switch>
        </Suspense>
      </PageSection>
    </>
  );
};
