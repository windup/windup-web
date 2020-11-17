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
  const handleOnPostDelete = (execution: WindupExecution) => {
    push(
      formatPath(Paths.executions, {
        project: match.params.project,
      })
    );
  };

  return (
    <>
      <ExecutionDetailsHeader
        projectId={match.params.project}
        executionId={match.params.execution}
        onPostDelete={handleOnPostDelete}
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

interface ExecutionDetailsHeaderProps {
  projectId: string;
  executionId: string;
  onPostDelete: (execution: WindupExecution) => void;
}

export const ExecutionDetailsHeader: React.FC<ExecutionDetailsHeaderProps> = ({
  projectId,
  executionId,
  onPostDelete,
}) => {
  const dispatch = useDispatch();

  const [execution, setExecution] = useState<WindupExecution>();

  useEffect(() => {
    getExecution(executionId).then(({ data: executionData }) => {
      setExecution(executionData);
    });
  }, [executionId]);

  const handleDeleteExecution = () => {
    if (!execution) {
      return;
    }

    dispatch(
      deleteDialogActions.openModal({
        name: `analysis #${execution.id.toString()}`,
        type: "analysis",
        onDelete: () => {
          dispatch(deleteDialogActions.processing);
          deleteExecution(execution.id).then(() => {
            dispatch(deleteDialogActions.closeModal());
            onPostDelete(execution);
          });
        },
        onCancel: () => {
          dispatch(deleteDialogActions.closeModal());
        },
      })
    );
  };

  return (
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
            project: projectId,
          }),
        },
        {
          title: "Details",
          path: formatPath(Paths.editExecution, {
            project: projectId,
            execution: executionId,
          }),
        },
      ]}
      menuActions={[{ label: "Delete", callback: handleDeleteExecution }]}
      navItems={[
        {
          title: "Details",
          path: formatPath(Paths.editExecution_overview, {
            project: projectId,
            execution: executionId,
          }),
        },
        {
          title: "Logs",
          path: formatPath(Paths.editExecution_logs, {
            project: projectId,
            execution: executionId,
          }),
        },
      ]}
    />
  );
};
