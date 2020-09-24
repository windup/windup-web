import * as React from "react";
import {
  PendingIcon,
  SyncIcon,
  BanIcon,
  CheckCircleIcon,
  ErrorCircleOIcon,
} from "@patternfly/react-icons";
import {
  global_success_color_200 as globalSuccessColor200,
  global_danger_color_200 as globalDangerColor200,
} from "@patternfly/react-tokens";

export type State = "QUEUED" | "STARTED" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface ExecutionStatusProps {
  state: State;
}

export const ExecutionStatus: React.FC<ExecutionStatusProps> = ({ state }) => {
  return (
    <span>
      {mapIcon(state)}&nbsp;{mapLabel(state)}
    </span>
  );
};

const mapIcon = (state: State) => {
  switch (state) {
    case "QUEUED":
      return <PendingIcon />;
    case "STARTED":
      return <SyncIcon />;
    case "CANCELLED":
      return <BanIcon />;
    case "COMPLETED":
      return <CheckCircleIcon color={globalSuccessColor200.value} />;
    case "FAILED":
      return <ErrorCircleOIcon color={globalDangerColor200.value} />;
    default:
      return "Unknown";
  }
};

const mapLabel = (state: State) => {
  switch (state) {
    case "QUEUED":
      return "Pending";
    case "STARTED":
      return "Running";
    case "CANCELLED":
      return "Cancelled";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    default:
      return "Unknown";
  }
};
