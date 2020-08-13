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
import { Project } from "../../../models/api";
import { FetchStatus } from "../../../store/common";
import { deleteDialogActions } from "../../../store/deleteDialog";
import { deleteProject } from "../../../api/api";
import {
  getDeleteSuccessAlertModel,
  getDeleteErrorAlertModel,
} from "../../../Constants";
import { Paths } from "../../../Paths";
import {
  SimplePageSection,
  FetchTable,
  SimplePagination,
  PageSkeleton,
  Welcome,
  FilterToolbarItem,
} from "../../../components";

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
}) => {
  const [filterText, setFilterText] = useState("");
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState<ISortBy>();

  const columns: ICell[] = [
    { title: "Name", transforms: [cellWidth(30), sortable] },
    { title: "Applications", transforms: [sortable] },
    { title: "Status", transforms: [] },
    { title: "Description", transforms: [] },
  ];
  const [rows, setRows] = useState<IRow[]>();
  const actions: IActions = [
    {
      title: "Edit",
      onClick: (_) => {
        console.log("Edit");
      },
    },
    {
      title: "Delete",
      onClick: (_, rowIndex: number) => {
        const project = projects![rowIndex];

        showDeleteDialog({
          name: "project.name",
          type: "project",
          onDelete: () => {
            processingDeleteDialog();
            deleteProject(project)
              .then(() => {
                addAlert(getDeleteSuccessAlertModel("Project"));
                fetchProjects();
              })
              .catch(() => {
                addAlert(getDeleteErrorAlertModel("Project"));
              })
              .finally(() => closeDeleteDialog());
          },
          onCancel: () => {
            closeDeleteDialog();
          },
        });
      },
    },
  ];

  useEffect(() => {
    if (projects) {
      let sortedProjects: Project[];

      const columnSortIndex = sortBy?.index;
      const columnSortDirection = sortBy?.direction;

      switch (columnSortIndex) {
        case 0: // title
          sortedProjects = projects.sort((a, b) =>
            a.migrationProject.title.localeCompare(b.migrationProject.title)
          );
          break;
        case 1: // title
          sortedProjects = projects.sort(
            (a, b) => a.applicationCount - b.applicationCount
          );
          break;
        default:
          sortedProjects = projects;
      }

      if (columnSortDirection === SortByDirection.desc) {
        sortedProjects = sortedProjects.reverse();
      }

      const rows: IRow[] = sortedProjects.map((item: Project) => {
        return {
          cells: [
            {
              title: item.migrationProject.title,
            },
            {
              title: item.applicationCount,
            },
            {
              title: item.migrationProject.lastModified,
            },
            {
              title: item.migrationProject.description,
            },
          ],
        };
      });

      setRows(rows);
    }
  }, [projects, sortBy]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLERS

  const handlFilterTextChange = (filterText: string) => {
    const newParams = { page: 1, perPage: paginationParams.perPage };

    // fetchOrganizations(filterText, newParams.page, newParams.perPage);

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
    // fetchOrganizations(filterText, page, perPage);
    setPaginationParams({ page, perPage });
  };

  const handleNewProject = () => {
    console.log("new project");
  };

  if (!error && projects && projects.length === 0) {
    return (
      <Bullseye>
        <Welcome onPrimaryAction={handleNewProject} />
      </Bullseye>
    );
  }

  return (
    <React.Fragment>
      {projects || error ? (
        <React.Fragment>
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
                    count={projects ? projects.length : 0}
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
              count={projects ? projects.length : 0}
              params={paginationParams}
              onChange={handlePaginationChange}
            />
          </PageSection>
        </React.Fragment>
      ) : (
        <PageSkeleton />
      )}
    </React.Fragment>
  );
};
