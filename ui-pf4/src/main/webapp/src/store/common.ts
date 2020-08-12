import { MapDispatchToProps, MapStateToProps } from "react-redux";
import { RootState } from "./rootReducer";
import { AxiosError } from "axios";

export type FetchStatus = "none" | "inProgress" | "complete";

export interface ObjectData<T> {
  data: T | undefined;
  error: AxiosError | undefined;
  fetchStatus: FetchStatus | undefined;
}

export function createMapStateToProps<OwnProps, StateProps>(
  mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState>
) {
  return mapStateToProps;
}

export function createMapDispatchToProps<OwnProps, DispatchProps>(
  mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps>
) {
  return mapDispatchToProps;
}
