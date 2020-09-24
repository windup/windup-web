import React from "react";

import { WINDUP_ENV_VARIABLES } from "Constants";
import { WindupExecution } from "models/api";
import { EXECUTION_PROGRESS_URL } from "api/api";

export interface ChildrenProps {
  wachedExecution: WindupExecution;
}

export interface ProjectStatusWatcherProps {
  execution: WindupExecution;
  children: (args: ChildrenProps) => React.ReactElement;
}

export const ProjectStatusWatcher: React.FC<ProjectStatusWatcherProps> = ({
  execution,
  children,
}) => {
  if (isExecutionActive(execution)) {
    let base = "";

    // In produccion we need to point to the server configured through ENV.
    // The server is not always the same server where the UI is deployed
    if (process.env.NODE_ENV === "production") {
      base = WINDUP_ENV_VARIABLES.REST_BASE + "/";
    }

    const url =
      base +
      EXECUTION_PROGRESS_URL.replace(/^http/, "ws").replace(
        ":executionId",
        execution.id.toString()
      );

    console.log(url);
    // const socket = this._websocketFactory.createWebSocketSubject(url);
    // socket.subscribe((execution: WindupExecution) =>
    //   this.onExecutionUpdate(execution)
    // );

    // this.executionSocket.set(execution.id, socket);

    // this._keycloakService.getToken().subscribe((token) => {
    //   socket.next(
    //     JSON.parse(
    //       JSON.stringify({
    //         authentication: {
    //           token: token,
    //         },
    //       })
    //     )
    //   );
    // });
  }

  return children({ wachedExecution: execution });
};

const isExecutionActive = (execution: WindupExecution) => {
  return execution.state === "STARTED" || execution.state === "QUEUED";
};
