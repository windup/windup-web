import React, { useCallback, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { LogView } from "components";

import { WindupExecution } from "models/api";
import { getExecution, getExecutionLog } from "api/api";

import { useProjectStatusWatcher } from "containers/project-status-watcher/useProjectStatusWatcher";

export interface RulesProps
  extends RouteComponentProps<{ project: string; execution: string }> {}

export const Logs: React.FC<RulesProps> = ({ match }) => {
  const [execution, setExecution] = React.useState<WindupExecution>();
  const [executionLog, setExecutionLog] = React.useState<string[]>();

  const watchedExecution = useProjectStatusWatcher(execution);

  const refreshLog = useCallback(() => {
    getExecutionLog(match.params.execution).then(({ data: logData }) => {
      setExecutionLog(logData);
    });
  }, [match]);

  useEffect(() => {
    getExecution(match.params.execution).then(({ data: executionData }) => {
      setExecution(executionData);
    });
  }, [match]);

  useEffect(() => {
    refreshLog();
  }, [watchedExecution, refreshLog]);

  return (
    <React.Fragment>
      {executionLog && <LogView lines={executionLog} />}
    </React.Fragment>
  );
};
