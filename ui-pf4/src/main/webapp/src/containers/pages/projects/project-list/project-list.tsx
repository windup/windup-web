import React, { useCallback, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { AxiosError } from "axios";
import Moment from "react-moment";

import {
  cellWidth,
  ICell,
  IRow,
  IActions,
  sortable,
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
  DeleteButton,
  AppPlaceholder,
  ConditionalRender,
  TableSectionOffline,
} from "components";

import { Paths } from "Paths";
import { getDeleteErrorAlertModel } from "Constants";
import { Project } from "models/api";
import { deleteProject } from "api/api";

import { FetchStatus } from "store/common";
import { deleteDialogActions } from "store/deleteDialog";

const columns: ICell[] = [
  { title: "Name", transforms: [cellWidth(20), sortable] },
  { title: "Applications", transforms: [sortable] },
  { title: "Status", transforms: [sortable] },
  { title: "Description", transforms: [cellWidth(30)] },
  { title: "", transforms: [] },
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
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const actions: IActions = [];

  const projectToIRow = useCallback(
    (projects: Project[]): IRow[] => {
      return projects.map((item) => ({
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
          {
            title: (
              <DeleteButton
                objType="Project"
                objID={item.migrationProject.title}
                messageMatch={item.migrationProject.title}
                isDisabled={!item.isDeletable}
                onDelete={() => {
                  deleteProject(item.migrationProject)
                    .then(() => {
                      fetchProjects();
                    })
                    .catch(() => {
                      addAlert(getDeleteErrorAlertModel("Project"));
                    });
                }}
              />
            ),
          },
        ],
      }));
    },
    [fetchProjects, addAlert]
  );

  const handleNewProject = () => {
    push(Paths.newProject);
  };

  if (projects && projects.length === 0 && !error) {
    return (
      <Bullseye>
        <Welcome onPrimaryAction={handleNewProject} />
      </Bullseye>
    );
  }

  return (
    <ConditionalRender when={!(projects || error)} then={<AppPlaceholder />}>
      <SimplePageSection title="Projects" />
      <PageSection>
        <TableSectionOffline
          items={projects || []}
          columns={columns}
          actions={actions}
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
  );
};
