import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError, AxiosPromise } from "axios";

import {
  Button,
  ModalVariant,
  PageSection,
  Modal,
} from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import {
  AddApplicationsTabs,
  SimplePageSection,
  AddApplicationsTabKey,
  ConditionalRender,
  AppPlaceholder,
  FetchErrorEmptyState,
} from "components";
import { AddApplicationsFormValue } from "components/add-applications-tabs/add-applications-tabs";

import { getAlertModel } from "Constants";
import { formatPath, Paths, ProjectRoute } from "Paths";
import { Application, MigrationProject } from "models/api";
import {
  getProjectById,
  pathTargetType,
  registerApplicationByPath,
  registerApplicationInDirectoryByPath,
} from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

export interface AddApplicationsProps
  extends RouteComponentProps<ProjectRoute> {}

export const AddApplications: React.FC<AddApplicationsProps> = ({
  match,
  history,
}) => {
  const dispatch = useDispatch();

  const [project, setProject] = useState<MigrationProject>();
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValue, setFormValue] = useState<AddApplicationsFormValue>();

  useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data }) => {
        setProject(data);
      })
      .catch(() => {
        setFetchError("Error while fetching project");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [match]);

  const handleOnFormChange = useCallback((value: AddApplicationsFormValue) => {
    setFormValue(value);
  }, []);

  const handleOnSave = () => {
    if (
      !formValue ||
      formValue.activeTabKey === AddApplicationsTabKey.UPLOAD_FILE
    ) {
      handleOnModalClose();
    }

    if (
      formValue &&
      formValue.activeTabKey === AddApplicationsTabKey.SERVER_PATH
    ) {
      setIsSubmitting(true);

      pathTargetType(formValue.tabServerPath?.serverPath!)
        .then(({ data }) => {
          let registerServerPathPromise: AxiosPromise<Application>;

          if (data === "DIRECTORY" && !formValue.tabServerPath?.isExploded) {
            registerServerPathPromise = registerApplicationInDirectoryByPath(
              project!.id,
              formValue.tabServerPath?.serverPath!
            );
          } else {
            registerServerPathPromise = registerApplicationByPath(
              project!.id,
              formValue.tabServerPath?.serverPath!,
              formValue.tabServerPath?.isExploded!
            );
          }

          return registerServerPathPromise;
        })
        .then(() => {
          handleOnModalClose();
        })
        .catch((error: AxiosError) => {
          dispatch(
            alertActions.alert(
              getAlertModel("danger", "Error", getAxiosErrorMessage(error))
            )
          );
          handleOnModalClose();
        });
    }
  };

  const handleOnModalClose = () => {
    history.push(
      formatPath(Paths.applications, {
        project: match.params.project,
      })
    );
  };

  return (
    <>
      <SimplePageSection title="Applications" />
      <PageSection>
        <Modal
          variant={ModalVariant.medium}
          title="Add applications"
          isOpen={true}
          onClose={handleOnModalClose}
          actions={
            isFetching || fetchError
              ? []
              : [
                  <Button
                    key="save"
                    variant="primary"
                    onClick={handleOnSave}
                    isDisabled={isSubmitting}
                  >
                    Save
                  </Button>,
                  <Button
                    key="close"
                    variant="link"
                    onClick={handleOnModalClose}
                  >
                    Close
                  </Button>,
                ]
          }
        >
          <ConditionalRender when={isFetching} then={<AppPlaceholder />}>
            {fetchError ? (
              <FetchErrorEmptyState />
            ) : (
              <>
                {project && (
                  <AddApplicationsTabs
                    projectId={project.id}
                    onChange={handleOnFormChange}
                  />
                )}
              </>
            )}
          </ConditionalRender>
        </Modal>
      </PageSection>
    </>
  );
};
