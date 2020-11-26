import React from "react";
import { useSelector, shallowEqual } from "react-redux";

import {
  Stack,
  StackItem,
  TextContent,
  Text,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";

import { useSubscribeToExecutionWs } from "hooks/useSubscribeToExecutionWs";

import { RootState } from "store/rootReducer";
import { projectExecutionsSelectors } from "store/projectExecutions";
import { executionsWsSelectors } from "store/executions-ws";

import { ActiveAnalysisProgressbar } from "components";
import { isExecutionActive } from "utils/modelUtils";

export interface ActiveExecutionsListProps {
  projectId: string;
}

export const ActiveExecutionsList: React.FC<ActiveExecutionsListProps> = ({
  projectId,
}) => {
  const executions = useSelector((state: RootState) =>
    projectExecutionsSelectors.selectProjectExecutions(state, projectId)
  );

  useSubscribeToExecutionWs(executions || []);
  const wsExecutions = useSelector(
    (state: RootState) =>
      executionsWsSelectors.selectMessagesByProjectId(
        state,
        parseInt(projectId)
      ),
    shallowEqual
  );

  const activeExecutions = (executions || [])
    .filter((e) => isExecutionActive(e))
    .map((e) => wsExecutions.find((w) => w.id === e.id) || e)
    .filter((e) => isExecutionActive(e));

  return (
    <>
      {activeExecutions.length > 0 && (
        <PageSection variant={PageSectionVariants.light}>
          <Stack>
            <StackItem>
              <TextContent>
                <Text component="h1">Active analysis</Text>
              </TextContent>
            </StackItem>
            {activeExecutions.map((e) => (
              <StackItem key={e.id}>
                {e.currentTask && e.workCompleted < e.totalWork && (
                  <ActiveAnalysisProgressbar activeExecution={e} />
                )}
              </StackItem>
            ))}
          </Stack>
        </PageSection>
      )}
    </>
  );
};
