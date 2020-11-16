import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Moment from "react-moment";

import {
  PageSection,
  Button,
  Bullseye,
  ToolbarItem,
  ToolbarGroup,
  ButtonVariant,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import {
  IRow,
  ICell,
  sortable,
  IRowData,
  IAction,
  ISeparator,
} from "@patternfly/react-table";
import {
  ChartBarIcon,
  DownloadIcon,
  CubesIcon,
  TrashIcon,
} from "@patternfly/react-icons";

import { RootState } from "store/rootReducer";
import {
  projectExecutionsSelectors,
  projectExecutionsActions,
} from "store/projectExecutions";

import {
  SimplePageSection,
  CustomEmptyState,
  ConditionalRender,
  SelectProjectEmptyMessage,
  TableSectionOffline,
  ExecutionStatus,
  ExecutionStatusWithTime,
} from "components";
import { useDeleteExecution } from "hooks/useDeleteExecution";
import { useCancelExecution } from "hooks/useCancelExecution";

import { Paths, formatPath, ProjectRoute } from "Paths";
import { WindupExecution, MigrationProject } from "models/api";
import {
  createProjectExecution,
  getAnalysisContext,
  getProjectById,
} from "api/api";

import { ProjectStatusWatcher } from "containers/project-status-watcher";

import { ActiveExecutionsList } from "./active-execution-list";
import {
  AdvancedOptionsFieldKey,
  getWindupStaticReportsBase,
  MERGED_CSV_FILENAME,
} from "Constants";
import { isNullOrUndefined } from "utils/utils";
import {
  isExecutionActive,
  isOptionEnabledInExecution,
} from "utils/modelUtils";

const EXECUTION_FIELD = "execution";

const columns: ICell[] = [
  { title: "Analysis", transforms: [sortable] },
  { title: "Status", transforms: [sortable] },
  { title: "Start date", transforms: [sortable] },
  { title: "Applications", transforms: [sortable] },
  {
    title: "Actions",
    transforms: [],
    props: {
      className: "pf-u-text-align-right",
    },
  },
];

const compareExecution = (
  a: WindupExecution,
  b: WindupExecution,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 0: // Analysis
      return a.id - b.id;
    case 1: // Status
      return a.state.localeCompare(b.state);
    case 2: // Start date
      return (a.timeStarted || 0) - (b.timeStarted || 0);
    case 3:
      return (
        a.analysisContext.applications.length -
        b.analysisContext.applications.length
      );
    default:
      return 0;
  }
};

const filterExecution = (filterText: string, execution: WindupExecution) => {
  return (
    execution.id.toString().toLowerCase().indexOf(filterText.toLowerCase()) !==
    -1
  );
};

const getStaticReportURL = (execution: WindupExecution) => {
  return `${getWindupStaticReportsBase()}/${
    execution.applicationListRelativePath
  }`;
};

const getCSVReportURL = (execution: WindupExecution) => {
  return `${getWindupStaticReportsBase()}/${
    execution.id
  }/${MERGED_CSV_FILENAME}`;
};

interface ExecutionListProps extends RouteComponentProps<ProjectRoute> {}

export const ExecutionList: React.FC<ExecutionListProps> = ({ match }) => {
  const [project, setProject] = useState<MigrationProject>();
  const [isCreatingExecution, setIsCreatingExecution] = useState(false);

  // Redux
  const baseExecutions = useSelector((state: RootState) =>
    projectExecutionsSelectors.selectProjectExecutions(
      state,
      match.params.project
    )
  );
  const executionsFetchStatus = useSelector((state: RootState) =>
    projectExecutionsSelectors.selectProjectExecutionsFetchStatus(
      state,
      match.params.project
    )
  );
  const executionsFetchError = useSelector((state: RootState) =>
    projectExecutionsSelectors.selectProjectExecutionsFetchError(
      state,
      match.params.project
    )
  );

  const executions = baseExecutions
    ? baseExecutions.slice().sort((a, b) => b.id - a.id) // By Default inverse order
    : undefined;

  const dispatch = useDispatch();

  const deleteExecution = useDeleteExecution();
  const cancelExecution = useCancelExecution();

  // Util function
  const refreshExecutionList = useCallback(
    (projectId: number | string) => {
      dispatch(projectExecutionsActions.fetchProjectExecutions(projectId));
    },
    [dispatch]
  );

  // First executions fetch
  useEffect(() => {
    if (!isNullOrUndefined(match.params.project)) {
      getProjectById(match.params.project).then(({ data }) => {
        setProject(data);
      });
    }
  }, [match]);
  useEffect(() => {
    if (!isNullOrUndefined(match.params.project)) {
      refreshExecutionList(match.params.project);
    }
  }, [match, refreshExecutionList]);

  // Fetch every 1s if any execution was cancelled
  useEffect(() => {
    if (executions) {
      const hasCancelledJobs = executions.find((execution) => {
        return (
          execution.state === "CANCELLED" && execution.timeCompleted == null
        );
      });
      if (hasCancelledJobs) {
        setTimeout(() => {
          refreshExecutionList(match.params.project);
        }, 1000);
      }
    }
  }, [match, executions, refreshExecutionList]);

  const handleDeleteAnalysis = useCallback(
    (row: WindupExecution) => {
      deleteExecution(row, () => {
        refreshExecutionList(match.params.project);
      });
    },
    [match, deleteExecution, refreshExecutionList]
  );

  const handleCancelAnalysis = useCallback(
    (row: WindupExecution) => {
      cancelExecution(row, () => {
        refreshExecutionList(match.params.project);
      });
    },
    [match, cancelExecution, refreshExecutionList]
  );

  const actionResolver = (rowData: IRowData): (IAction | ISeparator)[] => {
    const row: WindupExecution = getRow(rowData);

    const actions: (IAction | ISeparator)[] = [];

    if (row.state === "COMPLETED") {
      if (
        !isOptionEnabledInExecution(row, AdvancedOptionsFieldKey.SKIP_REPORTS)
      ) {
        actions.push({
          title: "Reports",
          onClick: (_, rowIndex: number, rowData: IRowData) => {
            const row: WindupExecution = getRow(rowData);
            window.open(getStaticReportURL(row), "_blank");
          },
        });
      }

      if (isOptionEnabledInExecution(row, AdvancedOptionsFieldKey.EXPORT_CSV)) {
        actions.push({
          title: "All Issues CSV",
          onClick: (_, rowIndex: number, rowData: IRowData) => {
            const row: WindupExecution = getRow(rowData);
            window.open(getCSVReportURL(row), "_blank");
          },
        });
      }
    }

    if (isExecutionActive(row)) {
      actions.push({
        title: "Cancel",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const row: WindupExecution = getRow(rowData);
          handleCancelAnalysis(row);
        },
      });
    } else {
      actions.push({
        title: "Delete",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const row: WindupExecution = getRow(rowData);
          handleDeleteAnalysis(row);
        },
      });
    }

    return actions;
  };

  const areActionsDisabled = (): boolean => {
    return false;
  };

  const getRow = (rowData: IRowData): WindupExecution => {
    return rowData[EXECUTION_FIELD];
  };

  const executionToIRow = useCallback(
    (executions: WindupExecution[]): IRow[] => {
      return executions.map((item) => ({
        [EXECUTION_FIELD]: item,
        cells: [
          {
            title: (
              <Link
                to={formatPath(Paths.editExecution_overview, {
                  project: match.params.project,
                  execution: item.id,
                })}
              >
                #{item.id}
              </Link>
            ),
          },
          {
            title: (
              <ProjectStatusWatcher watch={item}>
                {({ execution }) => (
                  <>
                    <ExecutionStatus state={execution.state} />
                    <ExecutionStatusWithTime
                      execution={execution}
                      showPrefix={true}
                    />
                  </>
                )}
              </ProjectStatusWatcher>
            ),
          },
          {
            title: (
              <ProjectStatusWatcher watch={item}>
                {({ execution }) =>
                  execution.timeStarted ? (
                    <Moment fromNow>{execution.timeStarted}</Moment>
                  ) : null
                }
              </ProjectStatusWatcher>
            ),
          },
          {
            title: item.analysisContext.applications.length,
          },
          {
            props: { textCenter: false },
            title: (
              <ProjectStatusWatcher watch={item}>
                {({ execution }) => (
                  <Flex
                    justifyContent={{ default: "justifyContentFlexEnd" }}
                    spaceItems={{ default: "spaceItemsNone" }}
                  >
                    {execution.state === "COMPLETED" && (
                      <>
                        {!isOptionEnabledInExecution(
                          execution,
                          AdvancedOptionsFieldKey.SKIP_REPORTS
                        ) && (
                          <FlexItem>
                            <a
                              title="Reports"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`${getStaticReportURL(execution)}`}
                              className="pf-c-button pf-m-link"
                            >
                              <ChartBarIcon />
                            </a>
                          </FlexItem>
                        )}
                        {isOptionEnabledInExecution(
                          execution,
                          AdvancedOptionsFieldKey.EXPORT_CSV
                        ) && (
                          <FlexItem>
                            <a
                              title="Download all issues CSV"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`${getCSVReportURL(execution)}`}
                              className="pf-c-button pf-m-link"
                            >
                              <DownloadIcon />
                            </a>
                          </FlexItem>
                        )}
                      </>
                    )}
                    {!isExecutionActive(execution) && (
                      <FlexItem>
                        <Button
                          variant={ButtonVariant.link}
                          onClick={() => handleDeleteAnalysis(execution)}
                        >
                          <TrashIcon />
                        </Button>
                      </FlexItem>
                    )}
                  </Flex>
                )}
              </ProjectStatusWatcher>
            ),
          },
        ],
      }));
    },
    [match, handleDeleteAnalysis]
  );

  const handleRunAnalysis = () => {
    setIsCreatingExecution(true);
    if (project) {
      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          return createProjectExecution(project.id, data);
        })
        .then(() => {
          dispatch(projectExecutionsActions.fetchProjectExecutions(project.id));
        })
        .finally(() => {
          setIsCreatingExecution(false);
        });
    }
  };

  return (
    <>
      {!isNullOrUndefined(match.params.project) && (
        <ActiveExecutionsList projectId={match.params.project} />
      )}
      <SimplePageSection title="Analysis results" />
      <PageSection>
        <ConditionalRender
          when={isNullOrUndefined(match.params.project)}
          then={<SelectProjectEmptyMessage />}
        >
          <TableSectionOffline
            items={executions}
            columns={columns}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
            loadingVariant={
              executions && executions.length > 0 ? "none" : "skeleton"
            }
            isLoadingData={executionsFetchStatus === "inProgress"}
            loadingDataError={executionsFetchError}
            compareItem={compareExecution}
            filterItem={filterExecution}
            mapToIRow={executionToIRow}
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Button
                    type="button"
                    onClick={handleRunAnalysis}
                    isDisabled={isCreatingExecution}
                  >
                    Run analysis
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
            emptyState={
              <Bullseye>
                <CustomEmptyState
                  icon={CubesIcon}
                  title="There are no analysis results for this project"
                  body="Configure the analysis settings and run an execution."
                  primaryAction={[
                    "Run analysis",
                    handleRunAnalysis,
                    isCreatingExecution,
                  ]}
                  secondaryActions={[]}
                />
              </Bullseye>
            }
          />
        </ConditionalRender>
      </PageSection>
    </>
  );
};
