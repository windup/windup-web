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

import { LogView } from "components";

import { ProjectExecutionRoute } from "Paths";
import { WindupExecution } from "models/api";
import { getExecution, getExecutionLog } from "api/api";

import { useProjectStatusWatcher } from "containers/project-status-watcher/useProjectStatusWatcher";

export interface RulesProps
  extends RouteComponentProps<ProjectExecutionRoute> {}

export const Logs: React.FC<RulesProps> = ({ match }) => {
  const [execution, setExecution] = useState<WindupExecution>();
  const [executionLog, setExecutionLog] = useState<string[]>();

  // Websocket
  const watchedExecution = useProjectStatusWatcher(execution);

  const refreshLog = useCallback(() => {
    getExecutionLog(match.params.execution).then(({ data: logData }) => {
      setExecutionLog(logData);
    });
  }, [match]);

  // Load execution
  useEffect(() => {
    getExecution(match.params.execution).then(({ data: executionData }) => {
      setExecution(executionData);
    });
  }, [match]);

  // Load log everytime the execution changes
  useEffect(() => {
    refreshLog();
  }, [refreshLog, watchedExecution]);

  const handleDownloadLog = () => {
    const data = (executionLog || []).join("\n");
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    let filename = `execution-${execution?.id}.log`;
    saveAs(blob, filename);
  };

  return (
    <>
      <Stack>
        <StackItem>
          <Flex>
            <FlexItem>
              {watchedExecution?.state === "QUEUED" ||
              watchedExecution?.state === "STARTED" ? (
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
            headerText={`${executionLog ? executionLog.length : 0} lines`}
            lines={executionLog || []}
            isStreamActive={
              watchedExecution?.state === "QUEUED" ||
              watchedExecution?.state === "STARTED"
            }
          />
        </StackItem>
      </Stack>
    </>
  );
};
