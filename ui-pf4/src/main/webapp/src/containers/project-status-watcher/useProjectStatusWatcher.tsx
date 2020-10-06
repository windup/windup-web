import { useEffect, useState } from "react";

import { useKeycloak } from "@react-keycloak/web";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { getWindupRestBase } from "Constants";
import { WindupExecution } from "models/api";
import { EXECUTION_PROGRESS_URL } from "api/api";

const isExecutionActive = (execution: WindupExecution) => {
  return execution.state === "STARTED" || execution.state === "QUEUED";
};

export const useProjectStatusWatcher = (
  execution?: WindupExecution
): WindupExecution | undefined => {
  const [keycloak] = useKeycloak();
  const [messageExecution, setMessageExecution] = useState<
    WindupExecution | undefined
  >(execution);

  useEffect(() => {
    if (execution && isExecutionActive(execution)) {
      const url = (getWindupRestBase() + EXECUTION_PROGRESS_URL)
        .replace(/^http/, "ws")
        .replace(":executionId", execution.id.toString());

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
  }, [execution, keycloak.token]);

  return messageExecution;
};
