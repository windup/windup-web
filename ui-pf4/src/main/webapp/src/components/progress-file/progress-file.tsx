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
import { TimesIcon, TrashIcon } from "@patternfly/react-icons";
import { Application } from "../../models/api";
import { formatBytes } from "../../utils/format";

export interface ProgressFileProps {
  file: File;
  progress: number;
  isUploading: boolean;
  finishedSuccessfully?: boolean;
  uploadCancelled?: boolean;
  onCancel: () => void;
  onRemove: () => void;
}

export const ProgressFile: React.FC<ProgressFileProps> = ({
  file,
  isUploading,
  progress,
  finishedSuccessfully,
  uploadCancelled,
  onCancel,
  onRemove,
}) => {
  return (
    <Split>
      <SplitItem isFilled>
        <Progress
          title={`${file.name} (${formatBytes(file.size)})`}
          label={uploadCancelled ? "Upload cancelled" : undefined}
          size={ProgressSize.sm}
          value={progress}
          variant={
            finishedSuccessfully === true
              ? ProgressVariant.success
              : finishedSuccessfully === false
              ? ProgressVariant.danger
              : undefined
          }
        />
      </SplitItem>
      <SplitItem>
        {isUploading ? (
          <Button
            variant={ButtonVariant.plain}
            aria-label="Action"
            onClick={onCancel}
          >
            <TimesIcon />
          </Button>
        ) : (
          <Button
            variant={ButtonVariant.plain}
            aria-label="Action"
            onClick={onRemove}
          >
            <TrashIcon />
          </Button>
        )}
      </SplitItem>
    </Split>
  );
};

export const UploadApplication: React.FC<{
  application: Application;
  onRemove: () => void;
}> = ({ application, onRemove }) => {
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
