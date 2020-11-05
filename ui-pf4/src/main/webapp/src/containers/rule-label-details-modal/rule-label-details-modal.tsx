import React, { useRef } from "react";
import { useSelector } from "react-redux";

import { Button, ButtonVariant, Modal } from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

import { RootState } from "store/rootReducer";
import { ruleLabelDetailsModalSelectors } from "store/ruleLabelDetailsModal";

import {
  ConditionalRender,
  CustomEmptyState,
  RulePathViewDetails,
} from "components";

export interface RuleLabelDetailsModalProps {}

export const RuleLabelDetailsModal: React.FC<RuleLabelDetailsModalProps> = () => {
  const modalRef = useRef<any>();

  const isOpen = useSelector((state: RootState) =>
    ruleLabelDetailsModalSelectors.isOpen(state)
  );
  const type = useSelector((state: RootState) =>
    ruleLabelDetailsModalSelectors.type(state)
  );
  const path = useSelector((state: RootState) =>
    ruleLabelDetailsModalSelectors.path(state)
  );
  const providers = useSelector((state: RootState) =>
    ruleLabelDetailsModalSelectors.providers(state)
  );
  const onClose = useSelector((state: RootState) =>
    ruleLabelDetailsModalSelectors.onClose(state)
  );

  return (
    <Modal
      ref={modalRef}
      title={`${type}${path ? "s" : ""} detail ${
        path ? " - " + (path?.shortPath || path?.path) : ""
      }`}
      width={"85%"}
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button key="close" variant={ButtonVariant.primary} onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {modalRef.current && (
        <ConditionalRender
          when={providers.length === 0}
          then={
            <CustomEmptyState
              icon={CubesIcon}
              title={`Empty ${type}`}
              body={`No content found`}
            />
          }
        >
          <RulePathViewDetails
            container={modalRef.current.getElement()}
            containerChildSelector=".pf-c-modal-box__body"
            providers={providers}
          />
        </ConditionalRender>
      )}
    </Modal>
  );
};
