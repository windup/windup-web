import React, { useState } from "react";
import { AxiosError } from "axios";

import { Button, Modal, ModalVariant } from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { AddRuleLabelTabs } from "components";

import { getAlertModel } from "Constants";
import { getAxiosErrorMessage } from "utils/modelUtils";
import { RuleLabel } from "models/api";

export interface AddRuleLabelButtonProps {
  type: RuleLabel;
  projectId?: number | string;
  uploadToGlobal: boolean;
  onModalClose: () => void;
}

export const AddRuleLabelButton: React.FC<AddRuleLabelButtonProps> = ({
  type,
  projectId,
  uploadToGlobal,
  onModalClose,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnModalToggle = () => {
    if (isModalOpen) {
      onModalClose();
    }

    setIsModalOpen((current) => !current);
  };

  const handleOnServerPathSaveError = (error: AxiosError) => {
    dispatch(
      alertActions.alert(
        getAlertModel("danger", "Error", getAxiosErrorMessage(error))
      )
    );

    handleOnModalToggle();
  };

  return (
    <>
      <Button type="button" onClick={handleOnModalToggle}>
        Add {`${type.toLocaleLowerCase()}`}
      </Button>
      <Modal
        variant={ModalVariant.medium}
        title={`Add ${type.toLowerCase()}s`}
        isOpen={isModalOpen}
        onClose={handleOnModalToggle}
      >
        <AddRuleLabelTabs
          type={type}
          projectId={projectId}
          uploadToGlobal={uploadToGlobal}
          onUploadClose={handleOnModalToggle}
          onServerPathSaved={handleOnModalToggle}
          onServerPathSaveError={handleOnServerPathSaveError}
          onServerPathCancel={handleOnModalToggle}
        />
      </Modal>
    </>
  );
};
