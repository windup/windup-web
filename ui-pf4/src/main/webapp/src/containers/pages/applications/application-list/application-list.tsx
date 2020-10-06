import React, { useState, useEffect, useCallback } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";
import Moment from "react-moment";
import { AxiosError } from "axios";

import {
  Bullseye,
  Button,
  PageSection,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  IActions,
  ICell,
  IRow,
  IRowData,
  sortable,
} from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import {
  ConditionalRender,
  CustomEmptyState,
  SimplePageSection,
  TableSectionOffline,
  FetchError,
} from "components";

import { formatPath, Paths, ProjectRoute } from "Paths";
import { isNullOrUndefined } from "utils/utils";

import { Application, MigrationProject } from "models/api";
import {
  deleteRegisteredApplication,
  getDownloadRegisteredApplicationURL,
  getProjectById,
} from "api/api";

import { deleteDialogActions } from "store/deleteDialog";

const columns: ICell[] = [
  { title: "Application", transforms: [sortable] },
  { title: "Date added", transforms: [sortable] },
];

const compareProject = (
  a: Application,
  b: Application,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 0: // Application
      return a.title.localeCompare(b.title);
    case 1: // Date added
      return a.lastModified - b.lastModified;
    default:
      return 0;
  }
};

const filterProject = (filterText: string, application: Application) => {
  return (
    application.title.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  );
};

export interface ApplicationListProps
  extends RouteComponentProps<ProjectRoute> {}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  match,
  history,
}) => {
  const dispatch = useDispatch();

  const [project, setProject] = useState<MigrationProject>();
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchMigrationProject = useCallback((projectId: string) => {
    setIsFetching(true);
    getProjectById(projectId)
      .then(({ data }) => {
        setProject(data);
        setFetchError("");
      })
      .catch((error: AxiosError) => {
        setFetchError(error.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    if (!isNullOrUndefined(match.params.project)) {
      fetchMigrationProject(match.params.project);
    }
  }, [match, fetchMigrationProject]);

  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row = rowData.props.application;

        dispatch(
          deleteDialogActions.openModal({
            name: `#${row.title}`,
            type: "application",
            onDelete: () => {
              dispatch(deleteDialogActions.processing());
              deleteRegisteredApplication(row.id)
                .then(() => {
                  fetchMigrationProject(match.params.project);
                })
                .finally(() => {
                  dispatch(deleteDialogActions.closeModal());
                });
            },
            onCancel: () => {
              dispatch(deleteDialogActions.closeModal());
            },
          })
        );
      },
    },
  ];

  const projectToIRow = useCallback((applications: Application[]): IRow[] => {
    return applications.map((item) => ({
      props: {
        application: item,
      },
      cells: [
        {
          title: (
            <a href={getDownloadRegisteredApplicationURL(item.id)}>
              {item.title}
            </a>
          ),
        },
        {
          title: <Moment fromNow>{item.lastModified}</Moment>,
        },
      ],
    }));
  }, []);

  const handleAddApplication = () => {
    history.push(
      formatPath(Paths.addApplications, {
        project: match.params.project,
      })
    );
  };

  return (
    <>
      <SimplePageSection title="Applications" />
      <PageSection>
        <ConditionalRender
          when={isNullOrUndefined(match.params.project)}
          then={<FetchError />}
        >
          <TableSectionOffline
            items={project?.applications || []}
            columns={columns}
            actions={actions}
            loadingVariant="skeleton"
            isLoadingData={isFetching}
            loadingDataError={fetchError}
            compareItem={compareProject}
            filterItem={filterProject}
            mapToIRow={projectToIRow}
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Button type="button" onClick={handleAddApplication}>
                    Add application
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
            emptyState={
              <Bullseye>
                <Bullseye>
                  <CustomEmptyState
                    icon={CubesIcon}
                    title="There are no applications in this project."
                    body="Upload an application by clicking on 'Add application'"
                  />
                </Bullseye>
              </Bullseye>
            }
          />
        </ConditionalRender>
      </PageSection>
    </>
  );
};
