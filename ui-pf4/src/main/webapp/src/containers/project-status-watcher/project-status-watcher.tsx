import React from "react";

import { WindupExecution } from "models/api";

import { useSubscribeToExecutionWs } from "hooks/useSubscribeToExecutionWs";

import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { executionsWsSelectors } from "store/executions-ws";

export interface ChildrenProps {
  execution: WindupExecution;
}

export interface ProjectStatusWatcherProps {
  watch: WindupExecution;
  children: (args: ChildrenProps) => any;
}

export const ProjectStatusWatcher: React.FC<ProjectStatusWatcherProps> = ({
  watch,
  children,
}) => {
  useSubscribeToExecutionWs(watch);

  const executionWs = useSelector((state: RootState) =>
    executionsWsSelectors.selectMessage(state, watch.id)
  );

  return children({ execution: executionWs || watch });
};
