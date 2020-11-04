import React from "react";
import { useState } from "react";
import { AxiosError } from "axios";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { DeleteMatchModal } from "components";

import { getAlertModel } from "Constants";
import { MigrationProject } from "models/api";
import { deleteProject } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

export interface DeleteProjectModalProps {
  project: MigrationProject;
  onClose: (refresh: boolean) => void;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  project,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    deleteProject(project)
      .then(() => {
        setIsDeleting(false);
        onClose(true);
      })
      .catch((error: AxiosError) => {
        setIsDeleting(false);
        onClose(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  return (
    <DeleteMatchModal
      isModalOpen={true}
      title="Project details"
      message={`Are you sure you want to delete the project '${project.title}'? This will delete all resources associated with '${project.title}' and cannot be undone. Make sure this is something you really want to do!`}
      matchText={project.title}
      inProgress={isDeleting}
      onCancel={() => onClose(false)}
      onDelete={handleDelete}
    />
  );
};
