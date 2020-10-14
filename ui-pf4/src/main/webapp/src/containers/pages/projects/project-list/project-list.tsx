import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";

import { AxiosError } from "axios";
import Moment from "react-moment";

import {
  cellWidth,
  ICell,
  IRow,
  sortable,
  IRowData,
  IAction,
  ISeparator,
} from "@patternfly/react-table";
import {
  PageSection,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Bullseye,
} from "@patternfly/react-core";

import {
  SimplePageSection,
  Welcome,
  DeleteProjectModal,
  AppPlaceholder,
  ConditionalRender,
  TableSectionOffline,
} from "components";

import { formatPath, Paths } from "Paths";
import { getAlertModel, getDeleteErrorAlertModel } from "Constants";
import { Project } from "models/api";
import { deleteProject, getProjectExecutions } from "api/api";

import { FetchStatus } from "store/common";
import { deleteDialogActions } from "store/deleteDialog";

const PROJECT_FIELD_NAME = "project";

const columns: ICell[] = [
  { title: "Name", transforms: [cellWidth(20), sortable] },
  { title: "Applications", transforms: [sortable] },
  { title: "Status", transforms: [sortable] },
  { title: "Description", transforms: [cellWidth(30)] },
];

const compareProject = (a: Project, b: Project, columnIndex?: number) => {
  switch (columnIndex) {
    case 0: // title
      return a.migrationProject.title.localeCompare(b.migrationProject.title);
    case 1: // applicationCount
      return a.applicationCount - b.applicationCount;
    case 2: // lastModified
      return a.migrationProject.lastModified < b.migrationProject.lastModified
        ? -1
        : a.migrationProject.lastModified > b.migrationProject.lastModified
        ? 1
        : 0;
    default:
      return 0;
  }
};

const filterProject = (filterText: string, project: Project) => {
  return (
    project.migrationProject.title
      .toLowerCase()
      .indexOf(filterText.toLowerCase()) !== -1
  );
};

interface StateToProps {
  projects: Project[] | undefined;
  error: AxiosError<any> | null;
  fetchStatus: FetchStatus;
}

interface DispatchToProps {
  fetchProjects: () => Promise<void>;
  showDeleteDialog: typeof deleteDialogActions.openModal;
  closeDeleteDialog: typeof deleteDialogActions.closeModal;
  processingDeleteDialog: typeof deleteDialogActions.processing;
  addAlert: (alert: any) => void;
}

interface Props extends StateToProps, DispatchToProps, RouteComponentProps {}

export const ProjectList: React.FC<Props> = ({
  projects,
  fetchStatus,
  error,
  fetchProjects,
  addAlert,
  history: { push },
}) => {
  const [projectToDelete, setProjectToDelete] = useState<Project>();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const actionResolver = (): (IAction | ISeparator)[] => {
    return [
      {
        title: "Edit",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const project: Project = rowData[PROJECT_FIELD_NAME];
          push(
            formatPath(Paths.editProject, {
              project: project.migrationProject.id,
            })
          );
        },
      },
      {
        title: "Delete",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const project: Project = rowData[PROJECT_FIELD_NAME];
          changeProjectToDelete(project);
        },
      },
    ];
  };

  const areActionsDisabled = (rowData: IRowData): boolean => {
    // const project: Project = rowData[PROJECT_FIELD_NAME];
    // return !project.isDeletable;
    return false;
  };

  const projectToIRow = useCallback((projects: Project[]): IRow[] => {
    return projects.map((item) => ({
      [PROJECT_FIELD_NAME]: item,
      cells: [
        {
          title: item.migrationProject.title,
        },
        {
          title: item.applicationCount,
        },
        {
          title: (
            <span>
              Last updated{" "}
              <Moment fromNow>{item.migrationProject.lastModified}</Moment>
            </span>
          ),
        },
        {
          title: item.migrationProject.description,
        },
      ],
    }));
  }, []);

  const handleNewProject = () => {
    push(Paths.newProject);
  };

  const changeProjectToDelete = (project: Project) => {
    getProjectExecutions(project.migrationProject.id)
      .then(({ data: executions }) => {
        const inProgressExecution = executions.find((execution) => {
          return execution.state === "QUEUED" || execution.state === "STARTED";
        });

        if (inProgressExecution) {
          addAlert(
            getAlertModel(
              "danger",
              "Error",
              `Cannot delete project '${project.migrationProject.title}' while an analysis is in progress.`
            )
          );
        } else {
          setProjectToDelete(project);
        }
      })
      .catch((error: AxiosError) => {
        addAlert(getAlertModel("danger", "Error", error.message));
      });
  };

  const handleDeleteProject = () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    deleteProject(projectToDelete.migrationProject)
      .then(() => {
        fetchProjects();
        handleDeleteModalClose();
      })
      .catch(() => {
        addAlert(getDeleteErrorAlertModel("Project"));
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleDeleteModalClose = () => {
    setProjectToDelete(undefined);
  };

  if (projects && projects.length === 0 && !error) {
    return (
      <Bullseye>
        <Welcome onPrimaryAction={handleNewProject} />
      </Bullseye>
    );
  }

  return (
    <>
      <ConditionalRender when={!(projects || error)} then={<AppPlaceholder />}>
        <SimplePageSection title="Projects" />
        <PageSection>
          <TableSectionOffline
            items={projects || []}
            columns={columns}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
            loadingVariant="skeleton"
            isLoadingData={fetchStatus === "inProgress"}
            loadingDataError={error}
            compareItem={compareProject}
            filterItem={filterProject}
            mapToIRow={projectToIRow}
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Button type="button" onClick={handleNewProject}>
                    Create new
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
          />
        </PageSection>
      </ConditionalRender>
      {projectToDelete && (
        <DeleteProjectModal
          projectTitle={projectToDelete.migrationProject.title}
          matchText={projectToDelete.migrationProject.title}
          isModalOpen={true}
          inProgress={isDeleting}
          onDelete={handleDeleteProject}
          onCancel={handleDeleteModalClose}
        />
      )}
    </>
  );
};
