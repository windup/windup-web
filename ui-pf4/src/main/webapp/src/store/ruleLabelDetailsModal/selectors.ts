import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const ruleLabelDetailsModalState = (state: RootState) => state[stateKey];

export const isOpen = (state: RootState) =>
  ruleLabelDetailsModalState(state).isOpen;

export const type = (state: RootState) =>
  ruleLabelDetailsModalState(state).type;

export const path = (state: RootState) =>
  ruleLabelDetailsModalState(state).path;

export const providers = (state: RootState) =>
  ruleLabelDetailsModalState(state).providers;

export const onClose = (state: RootState) =>
  ruleLabelDetailsModalState(state).onClose;
