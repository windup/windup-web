import { ActionType, getType } from "typesafe-actions";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {
  WsConfig,
  ExecutionMessage,
  connect,
  subscribe,
  unsubscribe,
  opened,
  message,
  closed,
} from "./actions";
import { WindupExecution } from "models/api";

export const stateKey = "executions-ws";

export type ExecutionsWsState = Readonly<{
  byId: Map<number, W3CWebSocket>;
  isOpenById: Map<number, boolean>;
  messageById: Map<number, WindupExecution>;
  subscribedById: Map<number, number>;
}>;

export const defaultState: ExecutionsWsState = {
  byId: new Map(),
  isOpenById: new Map(),
  messageById: new Map(),
  subscribedById: new Map(),
};

export type ExecutionsWsAction = ActionType<
  | typeof connect
  | typeof subscribe
  | typeof unsubscribe
  | typeof opened
  | typeof message
  | typeof closed
>;

export function executionsWsReducer(
  state = defaultState,
  action: ExecutionsWsAction
): ExecutionsWsState {
  switch (action.type) {
    case getType(connect):
      const payloadWsConfig: WsConfig = action.payload as WsConfig;

      let newById = state.byId;
      if (!state.byId.has(payloadWsConfig.id)) {
        const websocket = new W3CWebSocket(payloadWsConfig.url);
        websocket.onopen = () => {
          payloadWsConfig.onOpen(websocket);
        };
        websocket.onmessage = (message) => {
          payloadWsConfig.onMessage(message, websocket);
        };
        websocket.onerror = (error) => {
          payloadWsConfig.onError(error, websocket);
        };
        websocket.onclose = () => {
          payloadWsConfig.onClose(websocket);
        };

        newById = new Map(state.byId).set(payloadWsConfig.id, websocket);
      }

      return {
        ...state,
        byId: newById,
      };
    case getType(subscribe):
      return {
        ...state,
        subscribedById: new Map(state.subscribedById).set(
          action.payload as number,
          (state.subscribedById.get(action.payload as number) || 0) + 1
        ),
      };
    case getType(unsubscribe):
      return {
        ...state,
        subscribedById: new Map(state.subscribedById).set(
          action.payload as number,
          (state.subscribedById.get(action.payload as number) || 0) - 1
        ),
      };
    case getType(opened):
      return {
        ...state,
        isOpenById: new Map(state.isOpenById).set(
          action.payload as number,
          true
        ),
      };
    case getType(closed):
      return {
        ...state,
        isOpenById: new Map(state.isOpenById).set(
          action.payload as number,
          false
        ),
      };
    case getType(message):
      const executionMessage: ExecutionMessage = action.payload as ExecutionMessage;

      return {
        ...state,
        messageById: new Map(state.messageById).set(
          executionMessage.id,
          executionMessage.execution
        ),
      };
    default:
      return state;
  }
}
