import { useEffect } from "react";

import { useKeycloak } from "@react-keycloak/web";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { useDispatch } from "react-redux";
import { executionsWsActions } from "store/executions-ws";

import { getWindupRestBase } from "Constants";
import { WindupExecution } from "models/api";
import { EXECUTION_PROGRESS_URL } from "api/api";
import { isExecutionActive } from "utils/modelUtils";

export const useSubscribeToExecutionWs = (
  execution: WindupExecution | WindupExecution[]
) => {
  const { keycloak } = useKeycloak();

  const dispatch = useDispatch();

  useEffect(() => {
    const executionArray: WindupExecution[] = Array.isArray(execution)
      ? [...execution]
      : [execution];

    // Subscribe
    executionArray.forEach((e) =>
      dispatch(executionsWsActions.subscribe(e.id))
    );

    executionArray.forEach((e) => {
      // If active init WS
      if (isExecutionActive(e)) {
        const url = (getWindupRestBase() + EXECUTION_PROGRESS_URL)
          .replace(/^http/, "ws")
          .replace(":executionId", e.id.toString());

        dispatch(
          executionsWsActions.connect({
            id: e.id,
            url: url,
            onOpen: (websocket: W3CWebSocket) => {
              dispatch(executionsWsActions.opened(e.id));
              websocket.send(
                JSON.stringify({
                  authentication: {
                    token: keycloak.token,
                  },
                })
              );
            },
            onMessage: (message: any, websocket: W3CWebSocket) => {
              const messageData: WindupExecution = JSON.parse(
                message.data as string
              );
              dispatch(
                executionsWsActions.message({
                  id: e.id,
                  execution: messageData,
                })
              );

              if (messageData.state === "COMPLETED") {
                websocket.close();
              }
            },
            onError: (error: any) => {
              console.log("Error connecting to socket", error);
            },
            onClose: () => {
              dispatch(executionsWsActions.closed(e.id));
            },
          })
        );
      }
    });

    return () => {
      // Unsubscribe
      executionArray.forEach((e) =>
        dispatch(executionsWsActions.unsubscribe(e.id))
      );
    };
  }, [execution, keycloak.token, dispatch]);
};
