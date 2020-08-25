import * as React from "react";
import {
  Progress,
  ProgressSize,
  ProgressVariant,
  Button,
  Split,
  SplitItem,
  ButtonVariant,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { Application } from "../../models/api";
import { formatBytes } from "../../utils/format";

export interface ProgressApplicationProps {
  application: Application;
  onRemove: () => void;
}

export const ProgressApplication: React.FC<ProgressApplicationProps> = ({
  application,
  onRemove,
}) => {
  return (
    <Split>
      <SplitItem isFilled>
        <Progress
          title={`${application.inputFilename} (${formatBytes(
            application.fileSize
          )})`}
          size={ProgressSize.sm}
          value={100}
          variant={ProgressVariant.success}
        />
      </SplitItem>
      <SplitItem>
        <Button
          variant={ButtonVariant.plain}
          aria-label="Action"
          onClick={onRemove}
        >
          <TrashIcon />
        </Button>
      </SplitItem>
    </Split>
  );
};
