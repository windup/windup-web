import React, { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { cellWidth, ICell, IRow, IActions } from "@patternfly/react-table";
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
  // const [] = useState("name");
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });

  const columns: ICell[] = [
    { title: "Name", transforms: [cellWidth(30)] },
    { title: "Applications", transforms: [] },
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
      let rows: IRow[] = projects.map((item: Project) => {
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
  }, [projects]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLERS

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
