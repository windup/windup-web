import React, { useEffect, useState } from "react";
import {
  HumanizeDuration,
  HumanizeDurationLanguage,
  HumanizeDurationOptions,
} from "humanize-duration-ts";

import { WindupExecution } from "models/api";
import { isExecutionActive } from "utils/modelUtils";

export const timePrefix = (execution: WindupExecution) => {
  if (execution.state === "STARTED" || execution.state === "QUEUED") {
    return "for";
  } else if (execution.state === "COMPLETED" || execution.state === "FAILED") {
    return "in";
  } else if (execution.state === "CANCELLED") {
    return "after";
  }
  return "unknown";
};

const humanizerOptions: HumanizeDurationOptions = {
  units: ["h", "m", "s"],
  round: true,
};
const humanizer = new HumanizeDuration(new HumanizeDurationLanguage());

export const getTime = (execution: WindupExecution, currentTime: number) => {
  if (execution.timeCompleted && execution.timeStarted) {
    return execution.timeCompleted - execution.timeStarted;
  } else if (execution.timeCompleted && !execution.timeStarted) {
    return execution.timeCompleted - execution.timeQueued;
  } else if (!execution.timeCompleted && !execution.timeStarted) {
    return currentTime - execution.timeQueued;
  } else if (!execution.timeCompleted && execution.timeStarted) {
    return currentTime - execution.timeStarted;
  }
  throw new Error("Could not determine time for execution");
};

export interface ExecutionStatusWithTimeProps {
  execution: WindupExecution;
  showPrefix: boolean;
}

export const ExecutionStatusWithTime: React.FC<ExecutionStatusWithTimeProps> = ({
  execution,
  showPrefix,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isExecutionActive(execution)) {
      setCurrentTime(new Date().getTime());
    }
  }, [execution]);

  return (
    <>
      <span>
        {showPrefix && <span>&nbsp;{timePrefix(execution)}&nbsp;</span>}
        <span>
          {humanizer.humanize(
            getTime(execution, currentTime),
            humanizerOptions
          )}
        </span>
      </span>
    </>
  );
};
