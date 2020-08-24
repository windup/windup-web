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

const formatNumber = (value: number, fractionDigits = 2) => {
  return value.toLocaleString("en", {
    style: "decimal",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GiB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const s = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return formatNumber(s, decimals) + " " + sizes[i];
};

export interface UploadFileProps {
  file: File;
  progress: number;
  isUploading: boolean;
  finishedSuccessfully?: boolean;
  uploadCancelled?: boolean;
  onCancel?: () => void;
  onRemove?: () => void;
}

export const UploadFile: React.FC<UploadFileProps> = ({
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
