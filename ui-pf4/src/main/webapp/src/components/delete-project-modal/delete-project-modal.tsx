import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ButtonVariant,
  ModalVariant,
  TextInput,
} from "@patternfly/react-core";

export interface DeleteProjectModalProps {
  isModalOpen: boolean;

  projectTitle: string;
  matchText: string;

  inProgress?: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isModalOpen,
  projectTitle,
  matchText,
  inProgress,
  onDelete,
  onCancel,
}) => {
  const [inputMatchValue, setInputMatchValue] = useState("");
  const [allowDeletion, setAllowDeletion] = useState(false);

  useEffect(() => {
    setAllowDeletion(matchText.toLowerCase() === inputMatchValue.toLowerCase());
  }, [inputMatchValue, matchText]);

  const handleDelete = () => {
    onDelete();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={`Confirm project deletion`}
      isOpen={isModalOpen}
      onClose={handleCancel}
      actions={[
        <Button
          key="delete"
          variant={ButtonVariant.danger}
          isDisabled={!allowDeletion || inProgress}
          onClick={handleDelete}
        >
          Delete
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={handleCancel}
          isDisabled={inProgress}
        >
          Cancel
        </Button>,
      ]}
    >
      <div className="pf-c-content">
        <p>
          Are you sure you want to delete the project '{projectTitle}'? This
          will delete all resources associated with '{projectTitle}' and cannot
          be undone. Make sure this is something you really want to do!
        </p>

        <p>Type '{matchText}' to confirm.</p>

        <TextInput
          value={inputMatchValue}
          type="text"
          onChange={(value) => setInputMatchValue(value)}
          aria-label="Text input match"
        />
      </div>
    </Modal>
  );
};
