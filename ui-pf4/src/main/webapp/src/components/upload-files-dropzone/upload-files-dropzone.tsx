import React from "react";
import { useReducer } from "react";
import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";
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

import "./upload-files-dropzone.scss";

import { getMapKeys } from "utils/utils";
import { formatBytes } from "utils/format";
import BackendAPIClient from "api/apiClient";

const CANCEL_MESSAGE = "cancelled";

interface PromiseConfig {
  formData: FormData;
  config: any;

  thenFn: (response: AxiosResponse) => void;
  catchFn: (error: AxiosError) => void;
}

interface Upload {
  progress: number;
  status: "queued" | "inProgress" | "complete";
  error?: any;
  wasCancelled: boolean;
  cancelFn?: CancelTokenSource;
}
const defaultUpload: Upload = {
  progress: 0,
  status: "queued",
  error: undefined,
  wasCancelled: false,
  cancelFn: undefined,
};

interface Status {
  uploads: Map<File, Upload>;
  uploadsResponse: Map<File, any>;
}
interface Action {
  type:
    | "queueUpload"
    | "updateUploadProgress"
    | "finishUpload"
    | "removeUpload";
  payload: any;
}

const reducer = (state: Status, action: Action): Status => {
  switch (action.type) {
    case "queueUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          status: "queued",
          cancelFn: action.payload.cancelFn,
        }),
      };
    // case "startUpload":
    //   return {
    //     ...state,
    //     uploads: new Map(state.uploads).set(action.payload.file, {
    //       ...(state.uploads.get(action.payload.file) || defaultUpload),
    //       status: "inProgress",
    //     }),
    //   };
    case "updateUploadProgress":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          progress: action.payload.progress || 0,
          status: "inProgress",
        }),
      };
    case "finishUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "complete",
          error: action.payload.error,
          wasCancelled: action.payload.error?.message === CANCEL_MESSAGE,
        }),
        uploadsResponse: new Map(state.uploadsResponse).set(
          action.payload.file,
          action.payload.application
        ),
      };
    case "removeUpload":
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

export interface UploadFilesDropzoneProps {
  url: string;
  template: "dropdown-box" | "minimal-inline";
  accept?: string | string[];
  hideProgressOnSuccess?: boolean;
  allowRemove?: boolean;
  onFileUploadSuccess?: (data: any, file: File) => void;
  onFileUploadError?: (error: AxiosError, file: File) => void;
}

export const UploadFilesDropzone: React.FC<UploadFilesDropzoneProps> = ({
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
    const promisesQueue: PromiseConfig[] = [];

    for (let index = 0; index < acceptedFiles.length; index++) {
      const file = acceptedFiles[index];

      // Upload
      const formData = new FormData();
      formData.set("file", file);

      const cancelFn = axios.CancelToken.source();

      const config = {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          dispatch({
            type: "updateUploadProgress",
            payload: { file, progress: Math.round(progress) },
          });
        },
        cancelToken: cancelFn.token,
      };

      dispatch({
        type: "queueUpload",
        payload: {
          file,
          cancelFn,
        },
      });

      const thenFn = (response: AxiosResponse) => {
        dispatch({
          type: "finishUpload",
          payload: { file, application: response.data, error: undefined },
        });

        if (onFileUploadSuccess) onFileUploadSuccess(response.data, file);
      };

      const catchFn = (error: AxiosError) => {
        dispatch({
          type: "finishUpload",
          payload: { file, application: undefined, error },
        });

        if (error.message !== CANCEL_MESSAGE) {
          if (onFileUploadError) onFileUploadError(error, file);
        }
      };

      promisesQueue.push({ formData, config, thenFn, catchFn });
    }

    // Use reduce and await for sequential upload
    // Note: Parallel upload generates errors in the backend.
    promisesQueue.reduce(async (previousPromise, nextPromise) => {
      await previousPromise;
      return BackendAPIClient.post(
        url,
        nextPromise.formData,
        nextPromise.config
      )
        .then(nextPromise.thenFn)
        .catch(nextPromise.catchFn);
    }, Promise.resolve());
  };

  const handleCancelUpload = (file: File, upload: Upload) => {
    upload.cancelFn!.cancel(CANCEL_MESSAGE);
  };

  const handleRemoveUpload = (file: File, upload: Upload) => {
    dispatch({
      type: "removeUpload",
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
    <>
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
                  Drag a file here or browse to upload.
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
                            aria-label="cancel-upload"
                            onClick={() => handleCancelUpload(file, upload)}
                          >
                            <TimesIcon />
                          </Button>
                        )}
                        {upload.status === "complete" && allowRemove && (
                          <Button
                            variant={ButtonVariant.plain}
                            aria-label="delete-upload"
                            onClick={() => handleRemoveUpload(file, upload)}
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
    </>
  );
};
