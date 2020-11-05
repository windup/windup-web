import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ButtonVariant,
  ModalVariant,
  TextInput,
} from "@patternfly/react-core";

export interface DeleteMatchModalProps {
  isModalOpen: boolean;

  title: string;
  message: string;

  matchText: string;

  inProgress?: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export const DeleteMatchModal: React.FC<DeleteMatchModalProps> = ({
  isModalOpen,
  title,
  message,
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
      title={title}
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
        <p>{message}</p>

        <p>Type '{matchText}' to confirm.</p>

        <TextInput
          type="text"
          id="matchText"
          name="matchText"
          value={inputMatchValue}
          onChange={(value) => setInputMatchValue(value)}
          aria-label="Text input match"
        />
      </div>
    </Modal>
  );
};
