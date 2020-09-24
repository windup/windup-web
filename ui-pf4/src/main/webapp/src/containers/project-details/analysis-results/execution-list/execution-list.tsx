import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
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
  ButtonVariant,
} from "@patternfly/react-core";
import {
  ISortBy,
  IRow,
  ICell,
  sortable,
  IActions,
  SortByDirection,
} from "@patternfly/react-table";
import { InfoIcon, ChartBarIcon } from "@patternfly/react-icons";

import {
  SimplePageSection,
  CustomEmptyState,
  SimplePagination,
  FilterToolbarItem,
  FetchTable,
  ExecutionStatus,
} from "components";

import { WindupExecution } from "models/api";
import { getProjectExecutions } from "api/api";
import { Paths, formatPath } from "Paths";

import { ProjectStatusWatcher } from "../../project-status-watcher";

const isExecutionActive = (execution: WindupExecution) => {
  return execution.state === "STARTED" || execution.state === "QUEUED";
};

interface ExecutionListProps extends RouteComponentProps<{ project: string }> {}

export const ExecutionList: React.FC<ExecutionListProps> = ({ match }) => {
  // const [, setProject] = React.useState<MigrationProject>();
  // const [, setAnalysisContext] = React.useState<AnalysisContext>();

  // const [, setIsFetching] = React.useState(true);
  // const [, setFetchError] = React.useState<string>();

  const [executions, setExecutions] = React.useState<WindupExecution[]>();
  const [, setActiveExecutions] = React.useState<WindupExecution[]>();

  // Table props
  const [tableData, setTableData] = React.useState<WindupExecution[]>([]);
  const [tableDataFetchError, setTableDataFetchError] = React.useState("");

  const [filterText, setFilterText] = React.useState("");
  const [paginationParams, setPaginationParams] = React.useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = React.useState<ISortBy>();
  const [rows, setRows] = React.useState<IRow[]>();

  const columns: ICell[] = [
    { title: "Analysis", transforms: [sortable] },
    { title: "Status", transforms: [sortable] },
    { title: "Start date", transforms: [sortable] },
    { title: "Applications", transforms: [sortable] },
    { title: "Actions", transforms: [] },
  ];
  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_) => {},
    },
  ];

  const refreshExecutionList = React.useCallback(
    (projectId: number | string) => {
      getProjectExecutions(projectId)
        .then(({ data }) => {
          setExecutions(data);

          // If there are cancelled jobs that have not yet had a cancelled date added, then refresh the list
          const hasCancelledJobs = data.find((execution) => {
            return (
              execution.state === "CANCELLED" && execution.timeCompleted == null
            );
          });
          if (hasCancelledJobs) {
            setTimeout(() => {
              refreshExecutionList(projectId);
            }, 1000);
          }

          // Load activeExecutions;
          const activeExecutionsMap: Map<number, WindupExecution> = new Map();
          data
            .filter((execution) => isExecutionActive(execution))
            .forEach((execution) => {
              activeExecutionsMap.set(execution.id, execution);
              // this._windupExecutionService.watchExecutionUpdates(
              //   execution,
              //   this.project
              // );
            });
          setActiveExecutions(Array.from(activeExecutionsMap.values()));
        })
        .catch(() => {
          setTableDataFetchError("Could not load executions");
        });
    },
    []
  );

  React.useEffect(() => {
    refreshExecutionList(match.params.project);
  }, [match, refreshExecutionList]);

  // React.useEffect(() => {
  //   if (match.params.project) {
  //     getProjectById(match.params.project)
  //       .then(({ data }) => {
  //         setProject(data);
  //         return getAnalysisContext(data.defaultAnalysisContextId);
  //       })
  //       .then(({ data: analysisContextData }) => {
  //         setAnalysisContext(analysisContextData);
  //       })
  //       .catch(() => {
  //         setFetchError("Could not fetch migrationProject data");
  //       })
  //       .finally(() => {
  //         setIsFetching(false);
  //       });

  //     refreshExecutionList(match.params.project);
  //   } else {
  //     setIsFetching(false);
  //   }
  // }, [match, refreshExecutionList]);

  React.useEffect(() => {
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
                  to={formatPath(Paths.editProject_executionDetails, {
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
                <ProjectStatusWatcher execution={item}>
                  {({ wachedExecution }) => (
                    <ExecutionStatus state={wachedExecution.state} />
                  )}
                </ProjectStatusWatcher>
              ),
            },
            {
              title: <Moment fromNow>{item.timeStarted}</Moment>,
            },
            {
              title: item.analysisContext.applications.length,
            },
            {
              title: (
                <span>
                  <Button variant={ButtonVariant.link} icon={<ChartBarIcon />}>
                    Report
                  </Button>
                </span>
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
  }, [executions, filterText, paginationParams, sortBy, match]);

  // Table handlers

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

  return (
    <React.Fragment>
      {/* <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text component="h1">Active analysis</Text>
            </TextContent>
          </StackItem>
        </Stack>
      </PageSection> */}
      <SimplePageSection title="Analysis results" />
      <PageSection>
        {executions?.length === 0 && (
          <Bullseye>
            <CustomEmptyState
              icon={InfoIcon}
              title="There are no analysis results for this project"
              body="Configure the analysis settings and run an execution."
              primaryAction={["Run analysis", () => {}]}
              secondaryActions={[
                <Button variant="link">Configure analysis</Button>,
                <Button variant="link">Refresh page</Button>,
              ]}
            />
          </Bullseye>
        )}
        {executions && executions.length > 0 && (
          <React.Fragment>
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
                      onClick={() => {
                        console.log("Run analysis");
                      }}
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
              fetchStatus="complete" // Always 'complete' to avoid flash rendering of skeleton
              fetchError={tableDataFetchError}
              loadingVariant="skeleton"
              onSortChange={(sortBy: ISortBy) => {
                setSortBy(sortBy);
              }}
            />
            <SimplePagination
              count={tableData.length}
              params={paginationParams}
              onChange={handlePaginationChange}
            />
          </React.Fragment>
        )}
      </PageSection>
    </React.Fragment>
  );
};
