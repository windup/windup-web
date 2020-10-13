import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { saveAs } from "file-saver";

import {
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Button,
  ButtonVariant,
  Spinner,
} from "@patternfly/react-core";
import { DownloadIcon } from "@patternfly/react-icons";

import { AppPlaceholder, ConditionalRender, LogView } from "components";

import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { executionsWsSelectors } from "store/executions-ws";

import { ProjectExecutionRoute } from "Paths";
import { WindupExecution } from "models/api";
import { getExecution, getExecutionLog } from "api/api";
import { ProjectStatusWatcher } from "containers/project-status-watcher";
import { isExecutionActive } from "utils/modelUtils";

export interface RulesProps
  extends RouteComponentProps<ProjectExecutionRoute> {}

export const Logs: React.FC<RulesProps> = ({ match }) => {
  const [execution, setExecution] = useState<WindupExecution>();
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  // Load execution
  useEffect(() => {
    getExecution(match.params.execution).then(({ data: executionData }) => {
      setExecution(executionData);
    });
  }, [match]);

  const handleOnLogChange = useCallback((log: string[]) => {
    setExecutionLog(log);
  }, []);

  const handleDownloadLog = () => {
    const data = executionLog.join("\n");
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    let filename = `execution-${execution?.id}.log`;
    saveAs(blob, filename);
  };

  return (
    <ConditionalRender when={!execution} then={<AppPlaceholder />}>
      <LogFetchProxy execution={execution!} onLogChange={handleOnLogChange}>
        <ProjectStatusWatcher watch={execution!}>
          {({ execution: watchedExecution }) => (
            <Stack>
              <StackItem>
                <Flex>
                  <FlexItem>
                    {isExecutionActive(watchedExecution) ? (
                      <>
                        <Spinner size="sm" />
                        &nbsp;Loading log...
                      </>
                    ) : (
                      "Log loaded"
                    )}
                  </FlexItem>
                  <FlexItem align={{ default: "alignRight" }}>
                    <Button
                      type="button"
                      variant={ButtonVariant.link}
                      icon={<DownloadIcon />}
                      isInline
                      onClick={handleDownloadLog}
                    >
                      Download
                    </Button>
                  </FlexItem>
                </Flex>
              </StackItem>
              <StackItem>
                <LogView
                  headerText={`${executionLog.length} lines`}
                  lines={executionLog}
                  isStreamActive={isExecutionActive(watchedExecution)}
                />
              </StackItem>
            </Stack>
          )}
        </ProjectStatusWatcher>
      </LogFetchProxy>
    </ConditionalRender>
  );
};

interface LogFetchProxyProps {
  execution: WindupExecution;
  onLogChange: (log: string[]) => void;
}

export const LogFetchProxy: React.FC<LogFetchProxyProps> = ({
  execution,
  onLogChange,
  children,
}) => {
  const executionWs = useSelector((state: RootState) =>
    executionsWsSelectors.selectMessage(state, execution.id)
  );

  useEffect(() => {
    if (executionWs) {
      getExecutionLog(execution.id).then(({ data: logData }) => {
        onLogChange(logData);
      });
    }
  }, [execution, executionWs, onLogChange]);

  return <>{children}</>;
};
