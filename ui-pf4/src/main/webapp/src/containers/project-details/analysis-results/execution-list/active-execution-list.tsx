import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Stack,
  StackItem,
  TextContent,
  Text,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";

import { RootState } from "store/rootReducer";
import { executionsSelectors, executionsActions } from "store/executions";

import { ActiveAnalysisProgressbar } from "components";

import { ProjectStatusWatcher } from "../../project-status-watcher";

export interface ActiveExecutionsListProps {
  projectId: string;
}

export const ActiveExecutionsList: React.FC<ActiveExecutionsListProps> = ({
  projectId,
}) => {
  const dispatch = useDispatch();
  const executions = useSelector((state: RootState) =>
    executionsSelectors.selectExecutions(state, projectId)
  );
  const activeExecutions = (executions || []).filter((execution) => {
    return execution.state === "STARTED" || execution.state === "QUEUED";
  });

  return (
    <React.Fragment>
      {activeExecutions.length > 0 && (
        <PageSection variant={PageSectionVariants.light}>
          <Stack>
            <StackItem>
              <TextContent>
                <Text component="h1">Active analysis</Text>
              </TextContent>
            </StackItem>
            {activeExecutions.map((execution) => (
              <StackItem key={execution.id}>
                <ProjectStatusWatcher watch={execution}>
                  {({ execution: watchedExecution }) => {
                    if (
                      watchedExecution.state === "COMPLETED" ||
                      watchedExecution.state === "FAILED"
                    ) {
                      dispatch(executionsActions.fetchExecutions(projectId));
                    }

                    if (
                      watchedExecution.currentTask &&
                      watchedExecution.workCompleted <
                        watchedExecution.totalWork
                    ) {
                      return (
                        <ActiveAnalysisProgressbar
                          activeExecution={watchedExecution}
                        />
                      );
                    }
                    return null;
                  }}
                </ProjectStatusWatcher>
              </StackItem>
            ))}
          </Stack>
        </PageSection>
      )}
    </React.Fragment>
  );
};
