import React, { useState, useEffect, useCallback } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Moment from "react-moment";
import { AxiosError } from "axios";

import {
  Alert,
  Bullseye,
  PageSection,
  PageSectionVariants,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  IAction,
  ICell,
  IRow,
  IRowData,
  ISeparator,
  sortable,
} from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import {
  ConditionalRender,
  CustomEmptyState,
  TableSectionOffline,
  SelectProjectEmptyMessage,
} from "components";
import { useSubscribeToExecutionWs } from "hooks/useSubscribeToExecutionWs";

import { formatPath, Paths, ProjectRoute } from "Paths";
import { isNullOrUndefined } from "utils/utils";
import { isExecutionActive } from "utils/modelUtils";

import { Application, MigrationProject, WindupExecution } from "models/api";
import {
  deleteRegisteredApplication,
  getDownloadRegisteredApplicationURL,
  getProjectById,
  getProjectExecutions,
} from "api/api";

import { deleteDialogActions } from "store/deleteDialog";
import { AddApplicationButton } from "containers/add-application-button";
import { RootState } from "store/rootReducer";
import { executionsWsSelectors } from "store/executions-ws";

const APPLICATION_FIELD = "application";

const columns: ICell[] = [
  { title: "Application", transforms: [sortable] },
  { title: "Date added", transforms: [sortable] },
];

const compareFn = (a: Application, b: Application, columnIndex?: number) => {
  switch (columnIndex) {
    case 0: // Application
      return a.title.localeCompare(b.title);
    case 1: // Date added
      return a.lastModified - b.lastModified;
    default:
      return 0;
  }
};

const filterFn = (filterText: string, application: Application) => {
  return (
    application.title.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  );
};

export interface ApplicationListProps
  extends RouteComponentProps<ProjectRoute> {}

export const ApplicationList: React.FC<ApplicationListProps> = ({ match }) => {
  const dispatch = useDispatch();

  const [project, setProject] = useState<MigrationProject>();
  const [executions, setExecutions] = useState<WindupExecution[]>();
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchMigrationProject = useCallback((projectId: string) => {
    setIsFetching(true);
    getProjectById(projectId)
      .then(({ data }) => {
        setProject(data);
        return getProjectExecutions(data.id);
      })
      .then(({ data }) => {
        setExecutions(data);
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

  useSubscribeToExecutionWs(executions || []);
  const wsExecutions = useSelector(
    (state: RootState) =>
      executionsWsSelectors.selectMessagesByProjectId(
        state,
        parseInt(match.params.project)
      ),
    shallowEqual
  );

  const activeExecutions = (executions || [])
    .filter((e) => isExecutionActive(e))
    .map((e) => wsExecutions.find((w) => w.id === e.id) || e)
    .filter((e) => isExecutionActive(e));

  const actionResolver = (): (IAction | ISeparator)[] => {
    return [
      {
        title: "Delete",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const row: Application = rowData.props[APPLICATION_FIELD];

          dispatch(
            deleteDialogActions.openModal({
              name: `${row.title}`,
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
  };

  const areActionsDisabled = (): boolean => {
    return activeExecutions.length > 0;
  };

  const applicationToIRow = useCallback(
    (applications: Application[]): IRow[] => {
      return applications.map((item) => ({
        props: {
          [APPLICATION_FIELD]: item,
        },
        cells: [
          {
            title: item.exploded ? (
              item.title
            ) : (
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
    },
    []
  );

  const handleOnAddApplicationModalClose = () => {
    fetchMigrationProject(match.params.project);
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text component="h1">Applications</Text>
            </TextContent>
          </StackItem>
          {activeExecutions.length > 0 && (
            <StackItem>
              <Alert
                variant="info"
                isInline
                title="Cannot delete applications when analysis is in progress"
              >
                <p>
                  <Spinner size="md" /> Analysing applications.{" "}
                  <Link
                    to={formatPath(Paths.executions, {
                      project: match.params.project,
                    })}
                  >
                    See active analysis.
                  </Link>
                </p>
              </Alert>
            </StackItem>
          )}
        </Stack>
      </PageSection>
      <PageSection>
        <ConditionalRender
          when={isNullOrUndefined(match.params.project)}
          then={<SelectProjectEmptyMessage />}
        >
          <TableSectionOffline
            items={project?.applications}
            columns={columns}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
            loadingVariant="skeleton"
            isLoadingData={isFetching}
            loadingDataError={fetchError}
            compareItem={compareFn}
            filterItem={filterFn}
            mapToIRow={applicationToIRow}
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <AddApplicationButton
                    projectId={match.params.project}
                    onModalClose={handleOnAddApplicationModalClose}
                  />
                </ToolbarItem>
              </ToolbarGroup>
            }
            emptyState={
              <Bullseye>
                <CustomEmptyState
                  icon={CubesIcon}
                  title="There are no applications in this project"
                  body={
                    <p>
                      Upload an application by clicking on{" "}
                      <strong>Add application</strong>.
                    </p>
                  }
                />
              </Bullseye>
            }
          />
        </ConditionalRender>
      </PageSection>
    </>
  );
};
