import React, { useCallback, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import { AxiosError } from "axios";
import Moment from "react-moment";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { projectListActions, projectListSelectors } from "store/projectList";
import { alertActions } from "store/alert";

import {
  cellWidth,
  ICell,
  IRow,
  sortable,
  IRowData,
  IAction,
  ISeparator,
  truncate,
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
  AppPlaceholder,
  ConditionalRender,
  TableSectionOffline,
} from "components";

import { formatPath, Paths } from "Paths";
import { getAlertModel } from "Constants";
import { Project } from "models/api";
import { getProjectExecutions } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { EditProjectModal } from "./components/edit-project-modal";
import { DeleteProjectModal } from "./components/delete-project-modal";

const PROJECT_FIELD_NAME = "project";

const columns: ICell[] = [
  { title: "Name", transforms: [cellWidth(20), sortable] },
  { title: "Applications", transforms: [sortable] },
  { title: "Status", transforms: [sortable] },
  {
    title: "Description",
    transforms: [cellWidth(30)],
    cellTransforms: [truncate],
  },
];

export const compareProject = (
  a: Project,
  b: Project,
  columnIndex?: number
) => {
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

export const filterProject = (filterText: string, project: Project) => {
  return (
    project.migrationProject.title
      .toLowerCase()
      .indexOf(filterText.toLowerCase()) !== -1
  );
};

interface Props extends RouteComponentProps {}

export const ProjectList: React.FC<Props> = ({ history: { push } }) => {
  const dispatch = useDispatch();

  const [projectToEdit, setProjectToEdit] = useState<Project>();
  const [projectToDelete, setProjectToDelete] = useState<Project>();

  const projects = useSelector((state: RootState) =>
    projectListSelectors.projects(state)
  );
  const fetchStatus = useSelector((state: RootState) =>
    projectListSelectors.status(state)
  );
  const error = useSelector((state: RootState) =>
    projectListSelectors.error(state)
  );

  useEffect(() => {
    dispatch(projectListActions.fetchProjects());
  }, [dispatch]);

  const actionResolver = (): (IAction | ISeparator)[] => {
    return [
      {
        title: "Edit",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const project: Project = rowData[PROJECT_FIELD_NAME];
          setProjectToEdit(project);
        },
      },
      /**
       * Keep this in case we want to edit in a separate page
       */
      // {
      //   title: "Edit",
      //   onClick: (_, rowIndex: number, rowData: IRowData) => {
      //     const project: Project = rowData[PROJECT_FIELD_NAME];
      //     push(
      //       formatPath(Paths.editProject, {
      //         project: project.migrationProject.id,
      //       })
      //     );
      //   },
      // },
      {
        title: "Delete",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const project: Project = rowData[PROJECT_FIELD_NAME];
          changeProjectToDelete(project);
        },
      },
    ];
  };

  const areActionsDisabled = (): boolean => {
    return false;
  };

  const projectToIRow = useCallback((projects: Project[]): IRow[] => {
    return projects.map((item) => ({
      [PROJECT_FIELD_NAME]: item,
      cells: [
        {
          title: (
            <Link
              to={formatPath(Paths.executions, {
                project: item.migrationProject.id,
              })}
            >
              {item.migrationProject.title}
            </Link>
          ),
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
          dispatch(
            alertActions.alert(
              getAlertModel(
                "danger",
                "Error",
                `Cannot delete project '${project.migrationProject.title}' while an analysis is in progress.`
              )
            )
          );
        } else {
          setProjectToDelete(project);
        }
      })
      .catch((error: AxiosError) => {
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  const handleEditModalClose = (refresh: boolean) => {
    setProjectToEdit(undefined);
    if (refresh) {
      dispatch(projectListActions.fetchProjects());
    }
  };

  const handleDeleteModalClose = (refresh: boolean) => {
    setProjectToDelete(undefined);
    if (refresh) {
      dispatch(projectListActions.fetchProjects());
    }
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
            items={projects}
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
                    Create project
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
          />
        </PageSection>
      </ConditionalRender>
      {projectToDelete && (
        <DeleteProjectModal
          project={projectToDelete.migrationProject}
          onClose={handleDeleteModalClose}
        />
      )}
      {projectToEdit && (
        <EditProjectModal
          project={projectToEdit.migrationProject}
          onClose={handleEditModalClose}
        />
      )}
    </>
  );
};
