import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError } from "axios";
import { Project } from "../../../models/api";
import { FetchStatus } from "../../../store/common";
import { deleteDialogActions } from "../../../store/deleteDialog";

interface StateToProps {
  organizations: Project[] | undefined;
  error: AxiosError<any> | null;
  fetchStatus: FetchStatus;
}

interface DispatchToProps {
  fetchProjects: () => Promise<void>;
  showDeleteDialog: typeof deleteDialogActions.openModal;
  closeDeleteDialog: typeof deleteDialogActions.closeModal;
  processingDeleteDialog: typeof deleteDialogActions.processing;
  addAlert: (alert: any) => void;
}

interface Props extends StateToProps, DispatchToProps, RouteComponentProps {}

export const ProjectList: React.FC<Props> = ({ fetchProjects }) => {
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <p>Organization list</p>
    </React.Fragment>
  );
};
