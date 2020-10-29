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
  Split,
  SplitItem,
} from "@patternfly/react-core";
import {
  IRow,
  ICell,
  sortable,
  IActions,
  IRowData,
} from "@patternfly/react-table";
import { ChartBarIcon, DownloadIcon, CubesIcon } from "@patternfly/react-icons";

import { RootState } from "store/rootReducer";
import { executionsSelectors, executionsActions } from "store/executions";
import { deleteDialogActions } from "store/deleteDialog";

import {
  SimplePageSection,
  CustomEmptyState,
  ConditionalRender,
  SelectProjectEmptyMessage,
  TableSectionOffline,
  ExecutionStatus,
  ExecutionStatusWithTime,
} from "components";

import { Paths, formatPath, ProjectRoute } from "Paths";
import { WindupExecution, MigrationProject } from "models/api";
import {
  createProjectExecution,
  deleteExecution,
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
import { isOptionEnabledInExecution } from "utils/modelUtils";

const EXECUTION_FIELD = "execution";

const columns: ICell[] = [
  { title: "Analysis", transforms: [sortable] },
  { title: "Status", transforms: [sortable] },
  { title: "Start date", transforms: [sortable] },
  { title: "Applications", transforms: [sortable] },
  { title: "", transforms: [] },
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

interface ExecutionListProps extends RouteComponentProps<ProjectRoute> {}

export const ExecutionList: React.FC<ExecutionListProps> = ({ match }) => {
  const [project, setProject] = useState<MigrationProject>();
  const [isCreatingExecution, setIsCreatingExecution] = useState(false);

  // Redux
  const baseExecutions = useSelector((state: RootState) =>
    executionsSelectors.selectExecutions(state, match.params.project)
  );
  const executionsFetchStatus = useSelector((state: RootState) =>
    executionsSelectors.selectExecutionsFetchStatus(state, match.params.project)
  );
  const executionsFetchError = useSelector((state: RootState) =>
    executionsSelectors.selectExecutionsFetchError(state, match.params.project)
  );

  const executions = baseExecutions
    ? baseExecutions.slice().sort((a, b) => b.id - a.id) // By Default inverse order
    : undefined;

  const dispatch = useDispatch();

  // Util function
  const refreshExecutionList = useCallback(
    (projectId: number | string) => {
      dispatch(executionsActions.fetchExecutions(projectId));
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

  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: WindupExecution = rowData.props[EXECUTION_FIELD];

        dispatch(
          deleteDialogActions.openModal({
            name: `#${row.id.toString()}`,
            type: "analysis",
            onDelete: () => {
              dispatch(deleteDialogActions.processing());
              deleteExecution(row.id)
                .then(() => {
                  refreshExecutionList(match.params.project);
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

  const executionToIRow = useCallback(
    (executions: WindupExecution[]): IRow[] => {
      return executions.map((item) => ({
        props: {
          [EXECUTION_FIELD]: item,
        },
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
            title: (
              <ProjectStatusWatcher watch={item}>
                {({ execution }) =>
                  execution.state === "COMPLETED" ? (
                    <>
                      <Split hasGutter>
                        {!isOptionEnabledInExecution(
                          execution,
                          AdvancedOptionsFieldKey.SKIP_REPORTS
                        ) && (
                          <SplitItem>
                            <a
                              title="Reports"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`${getWindupStaticReportsBase()}/${
                                execution.applicationListRelativePath
                              }`}
                            >
                              <ChartBarIcon />
                            </a>
                          </SplitItem>
                        )}
                        {isOptionEnabledInExecution(
                          execution,
                          AdvancedOptionsFieldKey.EXPORT_CSV
                        ) && (
                          <SplitItem>
                            <a
                              title="Download all issues CSV"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`${getWindupStaticReportsBase()}/${
                                execution.id
                              }/${MERGED_CSV_FILENAME}`}
                            >
                              <DownloadIcon />
                            </a>
                          </SplitItem>
                        )}
                      </Split>
                    </>
                  ) : null
                }
              </ProjectStatusWatcher>
            ),
          },
        ],
      }));
    },
    [match]
  );

  const handleRunAnalysis = () => {
    setIsCreatingExecution(true);
    if (project) {
      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          return createProjectExecution(project.id, data);
        })
        .then(() => {
          dispatch(executionsActions.fetchExecutions(project.id));
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
            actions={actions}
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
