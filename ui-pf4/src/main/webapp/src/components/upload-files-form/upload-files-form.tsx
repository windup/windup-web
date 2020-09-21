import * as React from "react";
import { useReducer } from "react";
import axios, { CancelTokenSource } from "axios";
import {
  EmptyState,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Stack,
  StackItem,
  Split,
  SplitItem,
  Progress,
  ProgressVariant,
  ProgressSize,
  ButtonVariant,
  Level,
  LevelItem,
} from "@patternfly/react-core";
import { TimesIcon, TrashIcon } from "@patternfly/react-icons";

import { useDropzone } from "react-dropzone";

import "./upload-files-form.scss";

import { getMapKeys } from "utils/utils";
import { formatBytes } from "utils/format";
import BackendAPIClient from "api/apiClient";

const CANCEL_MESSAGE = "cancelled";

interface Upload {
  progress: number;
  status: "none" | "inProgress" | "complete";
  error?: any;
  wasCancelled: boolean;
  cancelToken?: CancelTokenSource;
}
const defaultUpload: Upload = {
  progress: 0,
  status: "none",
  wasCancelled: false,
};

interface Status {
  uploads: Map<File, Upload>;
  uploadsResponse: Map<File, any>;
}
interface Action {
  type:
    | "startFileUpload"
    | "updateFileUploadProgress"
    | "successFileUpload"
    | "failFileUpload"
    | "removeFileUpload";
  payload: any;
}

const reducer = (state: Status, action: Action): Status => {
  switch (action.type) {
    case "startFileUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          status: "inProgress",
          cancelToken: action.payload.cancelTokenSource,
        }),
      };
    case "updateFileUploadProgress":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          progress: action.payload.progress || 0,
        }),
      };
    case "successFileUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "complete",
        }),
        uploadsResponse: new Map(state.uploadsResponse).set(
          action.payload.file,
          action.payload.application
        ),
      };
    case "failFileUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "complete",
          error: action.payload.error,
          wasCancelled: action.payload.error.message === CANCEL_MESSAGE,
        }),
      };
    case "removeFileUpload":
      const newUploads = new Map(state.uploads);
      newUploads.delete(action.payload.file);

      const newUploadsResponse = new Map(state.uploadsResponse);
      newUploadsResponse.delete(action.payload.file);

      return {
        ...state,
        uploads: newUploads,
        uploadsResponse: newUploadsResponse,
      };
    default:
      throw new Error();
  }
};

export interface UploadFilesFormProps {
  url: string;
  template: "dropdown-box" | "minimal-inline";
  accept?: string | string[];
  hideProgressOnSuccess?: boolean;
  allowRemove?: boolean;
  onFileUploadSuccess?: (data: any, file: File) => void;
  onFileUploadError?: (error: any, file: File) => void;
}

export const UploadFilesForm: React.FC<UploadFilesFormProps> = ({
  url,
  accept,
  hideProgressOnSuccess,
  allowRemove,
  template,
  onFileUploadSuccess,
  onFileUploadError,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    uploads: new Map(),
    uploadsResponse: new Map(),
  } as Status);

  const handleUpload = (acceptedFiles: File[]) => {
    for (let index = 0; index < acceptedFiles.length; index++) {
      const file = acceptedFiles[index];

      // Upload
      const formData = new FormData();
      formData.set("file", file);

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const config = {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          dispatch({
            type: "updateFileUploadProgress",
            payload: { file, progress: Math.round(progress) },
          });
        },
        cancelToken: source.token,
      };

      dispatch({
        type: "startFileUpload",
        payload: { file, cancelTokenSource: source },
      });

      BackendAPIClient.post(url, formData, config)
        .then(({ data }) => {
          dispatch({
            type: "successFileUpload",
            payload: { file, application: data },
          });

          if (onFileUploadSuccess) onFileUploadSuccess(data, file);
        })
        .catch((error) => {
          dispatch({
            type: "failFileUpload",
            payload: { file, error },
          });

          if (error.message !== CANCEL_MESSAGE) {
            if (onFileUploadError) onFileUploadError(error, file);
          }
        });
    }
  };

  const handleCancelUpload = (file: File, upload: Upload) => {
    upload.cancelToken!.cancel(CANCEL_MESSAGE);
  };

  const handleremoveFileUpload = (file: File, upload: Upload) => {
    dispatch({
      type: "removeFileUpload",
      payload: { file },
    });
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDropAccepted: handleUpload,
    accept: accept,
  });

  return (
    <React.Fragment>
      <Stack hasGutter>
        <StackItem>
          {template === "dropdown-box" && (
            <div className="upload-files-section__component__tab-content-margin">
              <EmptyState
                variant={EmptyStateVariant.small}
                {...getRootProps({
                  className: "upload-files-section__component__dropzone",
                })}
              >
                <EmptyStateBody>
                  Drag a file here or browse to upload
                </EmptyStateBody>
                <Button variant="primary" onClick={open}>
                  Browse
                </Button>
                <input {...getInputProps()} />
              </EmptyState>
            </div>
          )}
          {template === "minimal-inline" && (
            <Level
              hasGutter
              {...getRootProps({
                className:
                  "upload-files-section__component__tab-content-margin",
              })}
            >
              <LevelItem>Select one or more files to upload</LevelItem>
              <LevelItem>
                <Button variant="primary" onClick={open}>
                  Browse
                </Button>
                <input {...getInputProps()} />
              </LevelItem>
            </Level>
          )}
        </StackItem>
        <StackItem>
          <Stack hasGutter>
            {getMapKeys(state.uploads)
              .filter((f) => {
                if (hideProgressOnSuccess) {
                  const upload = state.uploads.get(f);
                  return upload?.status !== "complete" || upload.error;
                }
                return true;
              })
              .map((file: File, index) => {
                const upload = state.uploads.get(file)!;
                return (
                  <StackItem key={index}>
                    <Split>
                      <SplitItem isFilled>
                        <Progress
                          title={`${file.name} (${formatBytes(file.size)})`}
                          label={upload.wasCancelled ? "Cancelled" : undefined}
                          size={ProgressSize.sm}
                          value={upload.progress}
                          variant={
                            upload.status === "complete" && upload.error
                              ? ProgressVariant.danger
                              : upload.status === "complete" && !upload.error
                              ? ProgressVariant.success
                              : undefined
                          }
                        />
                      </SplitItem>
                      <SplitItem>
                        {upload.status === "inProgress" && (
                          <Button
                            variant={ButtonVariant.plain}
                            aria-label="Action"
                            onClick={() => handleCancelUpload(file, upload)}
                          >
                            <TimesIcon />
                          </Button>
                        )}
                        {upload.status === "complete" && allowRemove && (
                          <Button
                            variant={ButtonVariant.plain}
                            aria-label="Action"
                            onClick={() => handleremoveFileUpload(file, upload)}
                          >
                            <TrashIcon />
                          </Button>
                        )}
                      </SplitItem>
                    </Split>
                  </StackItem>
                );
              })}
          </Stack>
        </StackItem>
      </Stack>
    </React.Fragment>
  );
};
