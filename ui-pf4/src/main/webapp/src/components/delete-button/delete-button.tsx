import * as React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ButtonVariant,
  ModalVariant,
  TextInput,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";

export interface DeleteButtonProps {
  objType: string;
  objID: string;
  messageMatch: string;
  isDisabled?: boolean;
  onDelete: () => void;
  onCancel?: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  objType,
  objID,
  messageMatch,
  isDisabled,
  onDelete,
  onCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMatchValue, setInputMatchValue] = useState("");
  const [allowDeletion, setAllowDeletion] = useState(false);

  useEffect(() => {
    setAllowDeletion(
      messageMatch.toLowerCase() === inputMatchValue.toLowerCase()
    );
  }, [inputMatchValue, messageMatch]);

  const handleModalToggle = () => {
    setIsModalOpen((val: boolean) => !val);
  };

  const handleDelete = () => {
    handleModalToggle();
    onDelete();
  };

  const handleCancel = () => {
    handleModalToggle();

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <React.Fragment>
      <Button
        variant={ButtonVariant.plain}
        aria-label="Delete"
        isDisabled={isDisabled}
        onClick={handleModalToggle}
      >
        <TrashIcon />
      </Button>
      <Modal
        variant={ModalVariant.small}
        title={`Confirm ${objType} deletion`}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button
            key="delete"
            variant={ButtonVariant.danger}
            isDisabled={!allowDeletion}
            onClick={handleDelete}
          >
            Delete
          </Button>,
          <Button key="cancel" variant="link" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div className="pf-c-content">
          <p>
            Are you sure you want to delete the project '{objID}'? This will
            delete all resources associated with '{objID}' and cannot be undone.
            Make sure this is something you really want to do!
          </p>

          <p>Type '{messageMatch}' to confirm.</p>

          <TextInput
            value={inputMatchValue}
            type="text"
            onChange={(value) => setInputMatchValue(value)}
            aria-label="Text input match"
          />
        </div>
      </Modal>
    </React.Fragment>
  );
};
