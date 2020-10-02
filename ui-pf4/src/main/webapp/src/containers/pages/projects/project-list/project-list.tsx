import React, { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { AxiosError } from "axios";
import {
  cellWidth,
  ICell,
  IRow,
  IActions,
  sortable,
  ISortBy,
  SortByDirection,
} from "@patternfly/react-table";
import {
  PageSection,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Button,
  ToolbarItemVariant,
  Bullseye,
} from "@patternfly/react-core";
import Moment from "react-moment";
import { Project } from "models/api";
import { FetchStatus } from "store/common";
import { deleteDialogActions } from "store/deleteDialog";
import { deleteProject } from "api/api";
import { getDeleteErrorAlertModel } from "Constants";
import { Paths } from "Paths";
import {
  SimplePageSection,
  FetchTable,
  SimplePagination,
  Welcome,
  FilterToolbarItem,
  DeleteButton,
  AppPlaceholder,
} from "components";

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
  showDeleteDialog,
  closeDeleteDialog,
  processingDeleteDialog,
  addAlert,
  history: { push },
}) => {
  const [filterText, setFilterText] = useState("");
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState<ISortBy>();

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const columns: ICell[] = [
    { title: "Name", transforms: [cellWidth(20), sortable] },
    { title: "Applications", transforms: [sortable] },
    { title: "Status", transforms: [sortable] },
    { title: "Description", transforms: [cellWidth(30)] },
    { title: "", transforms: [] },
  ];
  const [rows, setRows] = useState<IRow[]>();
  const actions: IActions = [
    // {
    //   title: "Edit",
    //   onClick: (_) => {
    //     console.log("Edit");
    //   },
    // },
    // {
    //   title: "Delete",
    //   onClick: (_, rowIndex: number) => {
    //     const project = projects![rowIndex];
    //     showDeleteDialog({
    //       name: project.migrationProject.title,
    //       type: "project",
    //       onDelete: () => {
    //         processingDeleteDialog();
    //         deleteProject(project.migrationProject)
    //           .then(() => {
    //             fetchProjects();
    //           })
    //           .catch(() => {
    //             addAlert(getDeleteErrorAlertModel("Project"));
    //           })
    //           .finally(() => closeDeleteDialog());
    //       },
    //       onCancel: () => {
    //         closeDeleteDialog();
    //       },
    //     });
    //   },
    // },
  ];

  useEffect(() => {
    if (projects) {
      // Sort
      let sortedProjects: Project[];

      const columnSortIndex = sortBy?.index;
      const columnSortDirection = sortBy?.direction;

      switch (columnSortIndex) {
        case 0: // title
          sortedProjects = projects.sort((a, b) =>
            a.migrationProject.title.localeCompare(b.migrationProject.title)
          );
          break;
        case 1: // applicationCount
          sortedProjects = projects.sort(
            (a, b) => a.applicationCount - b.applicationCount
          );
          break;
        case 2: // lastModified
          sortedProjects = projects.sort((a, b) =>
            a.migrationProject.lastModified < b.migrationProject.lastModified
              ? -1
              : a.migrationProject.lastModified >
                b.migrationProject.lastModified
              ? 1
              : 0
          );
          break;
        default:
          sortedProjects = projects;
      }

      if (columnSortDirection === SortByDirection.desc) {
        sortedProjects = sortedProjects.reverse();
      }

      // Filter
      const filteredProjects = sortedProjects.filter(
        (p) => p.migrationProject.title.toLowerCase().indexOf(filterText) !== -1
      );

      setFilteredProjects(filteredProjects);

      const rows: IRow[] = filteredProjects.map((item: Project) => {
        return {
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
        };
      });

      // Paginate
      const paginatedRows = rows.slice(
        (paginationParams.page - 1) * paginationParams.perPage,
        paginationParams.page * paginationParams.perPage
      );

      setRows(paginatedRows);
    }
  }, [projects, filterText, paginationParams, sortBy, addAlert, fetchProjects]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLERS

  const handlFilterTextChange = (filterText: string) => {
    const newParams = { page: 1, perPage: paginationParams.perPage };

    setFilterText(filterText);
    setPaginationParams(newParams);
  };

  const handlePaginationChange = ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => {
    setPaginationParams({ page, perPage });
  };

  const handleNewProject = () => {
    push(Paths.newProject);
  };

  if (!error && projects && projects.length === 0) {
    return (
      <Bullseye>
        <Welcome onPrimaryAction={handleNewProject} />
      </Bullseye>
    );
  }

  return (
    <>
      {projects || error ? (
        <>
          <SimplePageSection title="Projects" />
          <PageSection>
            <Toolbar>
              <ToolbarContent>
                <FilterToolbarItem
                  searchValue={filterText}
                  onFilterChange={handlFilterTextChange}
                  placeholder="Filter by name"
                />
                <ToolbarGroup variant="button-group">
                  <ToolbarItem>
                    <Link to={Paths.newProject}>
                      <Button>Create new</Button>
                    </Link>
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarItem
                  variant={ToolbarItemVariant.pagination}
                  alignment={{ default: "alignRight" }}
                >
                  <SimplePagination
                    count={filteredProjects.length}
                    params={paginationParams}
                    isTop={true}
                    onChange={handlePaginationChange}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <FetchTable
              columns={columns}
              rows={rows}
              actions={actions}
              fetchStatus={fetchStatus}
              fetchError={error}
              loadingVariant="skeleton"
              onSortChange={(sortBy: ISortBy) => {
                setSortBy(sortBy);
              }}
            />
            <SimplePagination
              count={filteredProjects.length}
              params={paginationParams}
              onChange={handlePaginationChange}
            />
          </PageSection>
        </>
      ) : (
        <AppPlaceholder />
      )}
    </>
  );
};
