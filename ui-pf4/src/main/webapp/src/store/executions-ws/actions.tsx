import { createAction } from "typesafe-actions";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { WindupExecution } from "models/api";

export interface WsConfig {
  id: number;
  url: string;
  onOpen: (websocket: W3CWebSocket) => void;
  onMessage: (message: any, websocket: W3CWebSocket) => void;
  onError: (error: any, websocket: W3CWebSocket) => void;
  onClose: (websocket: W3CWebSocket) => void;
}

export interface ExecutionMessage {
  id: number;
  execution: WindupExecution;
}

export const connect = createAction("executions/ws/connect")<WsConfig>();
export const subscribe = createAction("executions/ws/subscribe")<number>();
export const unsubscribe = createAction("executions/ws/unsubscribe")<number>();

export const opened = createAction("executions/ws/opened")<number>();
export const message = createAction("executions/ws/message")<
  ExecutionMessage
>();
export const closed = createAction("executions/ws/closed")<number>();
