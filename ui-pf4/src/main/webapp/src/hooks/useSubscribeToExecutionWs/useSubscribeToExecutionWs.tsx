import { useEffect } from "react";

import { useKeycloak } from "@react-keycloak/web";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { useDispatch } from "react-redux";
import { executionsWsActions } from "store/executions-ws";

import { getWindupRestBase } from "Constants";
import { WindupExecution } from "models/api";
import { EXECUTION_PROGRESS_URL } from "api/api";
import { isExecutionActive } from "utils/modelUtils";

export const useSubscribeToExecutionWs = (execution: WindupExecution) => {
  const [keycloak] = useKeycloak();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(executionsWsActions.subscribe(execution.id));

    if (isExecutionActive(execution)) {
      const url = (getWindupRestBase() + EXECUTION_PROGRESS_URL)
        .replace(/^http/, "ws")
        .replace(":executionId", execution.id.toString());

      dispatch(
        executionsWsActions.connect({
          id: execution.id,
          url: url,
          onOpen: (websocket: W3CWebSocket) => {
            dispatch(executionsWsActions.opened(execution.id));
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
                id: execution.id,
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
            dispatch(executionsWsActions.closed(execution.id));
          },
        })
      );
    }

    return () => {
      dispatch(executionsWsActions.unsubscribe(execution.id));
    };
  }, [execution, keycloak.token, dispatch]);
};
