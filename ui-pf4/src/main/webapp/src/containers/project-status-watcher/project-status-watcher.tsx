import React from "react";

import { useKeycloak } from "@react-keycloak/web";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { getWindupRestBase } from "Constants";
import { WindupExecution } from "models/api";
import { EXECUTION_PROGRESS_URL } from "api/api";

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
  const [messageExecution, setMessageExecution] = React.useState<
    WindupExecution
  >();
  const [keycloak] = useKeycloak();

  React.useEffect(() => {
    if (isExecutionActive(watch)) {
      const baseUrl = getWindupRestBase();
      const url = (baseUrl + EXECUTION_PROGRESS_URL)
        .replace(/^http/, "ws")
        .replace(":executionId", watch.id.toString());

      const socketClient = new W3CWebSocket(url);
      socketClient.onopen = () => {
        socketClient.send(
          JSON.stringify({
            authentication: {
              token: keycloak.token,
            },
          })
        );
      };
      socketClient.onmessage = (message) => {
        const messageData: WindupExecution = JSON.parse(message.data as string);
        setMessageExecution(messageData);

        // if (messageData.state === "COMPLETED") {
        //   socketClient.close();
        // }
      };

      return () => {
        socketClient.close();
      };
    }
  }, [watch, keycloak.token]);

  return children({ execution: messageExecution || watch });
};

const isExecutionActive = (execution: WindupExecution) => {
  return execution.state === "STARTED" || execution.state === "QUEUED";
};
