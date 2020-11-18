import React, { lazy, Suspense, useCallback, useEffect } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { PageSection, Label } from "@patternfly/react-core";

import { RootState } from "store/rootReducer";
import { executionActions, executionSelectors } from "store/execution";
import { projectExecutionsActions } from "store/projectExecutions";

import { Paths, formatPath, ProjectExecutionRoute } from "Paths";
import { WindupExecution } from "models/api";

import {
  PageHeader,
  mapStateToLabel,
  mapStateToIcon,
  AppPlaceholder,
} from "components";
import { useDeleteExecution } from "hooks/useDeleteExecution";
import { useCancelExecution } from "hooks/useCancelExecution";

import { ProjectStatusWatcher } from "containers/project-status-watcher";
import { isExecutionActive } from "utils/modelUtils";

const Overview = lazy(() => import("./overview"));
const Logs = lazy(() => import("./logs"));

export interface ExecutionDetailsProps
  extends RouteComponentProps<ProjectExecutionRoute> {}

export const ExecutionDetails: React.FC<ExecutionDetailsProps> = ({
  match,
  history: { push },
}) => {
  const handleOnPostDelete = () => {
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
        executionId={Number(match.params.execution)}
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
  executionId: number;
  onPostDelete: (execution: WindupExecution) => void;
}

export const ExecutionDetailsHeader: React.FC<ExecutionDetailsHeaderProps> = ({
  projectId,
  executionId,
  onPostDelete,
}) => {
  const dispatch = useDispatch();

  const deleteExecution = useDeleteExecution();
  const cancelExecution = useCancelExecution();

  const execution = useSelector((state: RootState) =>
    executionSelectors.selectExecution(state, executionId)
  );
  const executionFetchStatus = useSelector((state: RootState) =>
    executionSelectors.selectExecutionFetchStatus(state, executionId)
  );

  const refreshExecution = useCallback(
    (id: number) => {
      dispatch(executionActions.fetchExecution(id));
    },
    [dispatch]
  );

  useEffect(() => {
    refreshExecution(executionId);
  }, [executionId, refreshExecution]);

  const handleCancelExecution = () => {
    if (!execution) {
      return;
    }

    cancelExecution(execution, () => {
      refreshExecution(executionId);
      dispatch(projectExecutionsActions.fetchProjectExecutions(projectId));
    });
  };

  const handleDeleteExecution = () => {
    if (!execution) {
      return;
    }

    deleteExecution(execution, () => {
      onPostDelete(execution);
    });
  };

  return (
    <>
      {execution && (
        <ProjectStatusWatcher watch={execution}>
          {({ execution: watchedExecution }) => (
            <PageHeader
              title={`Analysis #${execution?.id}`}
              resourceStatus={
                <Label icon={mapStateToIcon(watchedExecution.state)}>
                  {mapStateToLabel(watchedExecution.state)}
                </Label>
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
              menuActions={
                executionFetchStatus === "inProgress"
                  ? []
                  : isExecutionActive(watchedExecution)
                  ? [{ label: "Cancel", callback: handleCancelExecution }]
                  : [{ label: "Delete", callback: handleDeleteExecution }]
              }
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
          )}
        </ProjectStatusWatcher>
      )}
    </>
  );
};
