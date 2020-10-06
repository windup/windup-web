import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Moment from "react-moment";

import {
  PageSection,
  Button,
  Bullseye,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItemVariant,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import {
  ISortBy,
  IRow,
  ICell,
  sortable,
  IActions,
  SortByDirection,
} from "@patternfly/react-table";
import { InfoIcon, ChartBarIcon, DownloadIcon } from "@patternfly/react-icons";

import { RootState } from "store/rootReducer";
import { executionsSelectors, executionsActions } from "store/executions";
import { deleteDialogActions } from "store/deleteDialog";

import {
  SimplePageSection,
  CustomEmptyState,
  SimplePagination,
  FilterToolbarItem,
  FetchTable,
  ExecutionStatus,
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

interface ExecutionListProps extends RouteComponentProps<ProjectRoute> {}

export const ExecutionList: React.FC<ExecutionListProps> = ({ match }) => {
  const [project, setProject] = useState<MigrationProject>();
  const [isCreatingExecution, setIsCreatingExecution] = useState(false);

  // Redux
  const executions = useSelector((state: RootState) =>
    executionsSelectors.selectExecutions(state, match.params.project)
  );
  const executionsFetchStatus = useSelector((state: RootState) =>
    executionsSelectors.selectExecutionsFetchStatus(state, match.params.project)
  );
  const executionsFetchError = useSelector((state: RootState) =>
    executionsSelectors.selectExecutionsFetchError(state, match.params.project)
  );

  const dispatch = useDispatch();

  // Util function
  const refreshExecutionList = useCallback(
    (projectId: number | string) => {
      dispatch(executionsActions.fetchExecutions(projectId));
    },
    [dispatch]
  );

  useEffect(() => {
    getProjectById(match.params.project).then(({ data }) => {
      setProject(data);
    });
  }, [match]);

  // First executions fetch
  useEffect(() => {
    refreshExecutionList(match.params.project);
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

  // Table props
  const [tableData, setTableData] = useState<WindupExecution[]>([]);

  const [filterText, setFilterText] = useState("");
  const [paginationmatch, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState<ISortBy>();
  const [rows, setRows] = useState<IRow[]>();

  const columns: ICell[] = [
    { title: "Analysis", transforms: [sortable] },
    { title: "Status", transforms: [sortable] },
    { title: "Start date", transforms: [sortable] },
    { title: "Applications", transforms: [sortable] },
    { title: "", transforms: [] },
  ];
  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number) => {
        const row = tableData![rowIndex];
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

  useEffect(() => {
    if (executions) {
      // Sort
      let sortedArray = [...executions].sort((a, b) => b.id - a.id);
      const columnSortIndex = sortBy?.index;
      const columnSortDirection = sortBy?.direction;
      switch (columnSortIndex) {
        case 0: // title
          sortedArray.sort((a, b) => a.id - b.id);
          break;
      }
      if (columnSortDirection === SortByDirection.desc) {
        sortedArray = sortedArray.reverse();
      }
      // Filter
      const filteredArray = sortedArray.filter(
        (p) => p.id.toString().indexOf(filterText) !== -1
      );
      setTableData(filteredArray);
      const rows: IRow[] = filteredArray.map((item) => {
        return {
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
                    <ExecutionStatus state={execution.state} />
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
                          {execution.analysisContext.generateStaticReports &&
                            execution.analysisContext.advancedOptions.find(
                              (f) => {
                                return (
                                  f.name ===
                                    AdvancedOptionsFieldKey.EXPORT_CSV &&
                                  f.value === "true"
                                );
                              }
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
        };
      });
      // Paginate
      const paginatedRows = rows.slice(
        (paginationmatch.page - 1) * paginationmatch.perPage,
        paginationmatch.page * paginationmatch.perPage
      );
      setRows(paginatedRows);
    }
  }, [executions, filterText, paginationmatch, sortBy, match]);

  // Table handlers

  const handlFilterTextChange = (filterText: string) => {
    const newParams = { page: 1, perPage: paginationmatch.perPage };
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

  //
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
      <ActiveExecutionsList projectId={match.params.project} />
      <SimplePageSection title="Analysis results" />
      <PageSection>
        {executions?.length === 0 && (
          <Bullseye>
            <CustomEmptyState
              icon={InfoIcon}
              title="There are no analysis results for this project"
              body="Configure the analysis settings and run an execution."
              primaryAction={["Run analysis", handleRunAnalysis]}
              secondaryActions={[]}
            />
          </Bullseye>
        )}
        {executions && executions.length > 0 && (
          <>
            <Toolbar>
              <ToolbarContent>
                <FilterToolbarItem
                  searchValue={filterText}
                  onFilterChange={handlFilterTextChange}
                  placeholder="Filter by name"
                />
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
                <ToolbarItem
                  variant={ToolbarItemVariant.pagination}
                  alignment={{ default: "alignRight" }}
                >
                  <SimplePagination
                    count={tableData.length}
                    params={paginationmatch}
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
              fetchStatus={executionsFetchStatus || "none"}
              fetchError={executionsFetchError}
              loadingVariant="spinner"
              onSortChange={(sortBy: ISortBy) => {
                setSortBy(sortBy);
              }}
            />
            <SimplePagination
              count={tableData.length}
              params={paginationmatch}
              onChange={handlePaginationChange}
            />
          </>
        )}
      </PageSection>
    </>
  );
};
