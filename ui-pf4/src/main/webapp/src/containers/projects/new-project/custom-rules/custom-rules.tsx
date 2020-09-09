import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
  Switch,
  Alert,
  AlertActionCloseButton,
  DrawerContent,
  DrawerContentBody,
  Drawer,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
} from "@patternfly/react-core";
import {
  ICell,
  sortable,
  IRow,
  ISortBy,
  SortByDirection,
  IActions,
} from "@patternfly/react-table";

import {
  FilterToolbarItem,
  SimplePagination,
  FetchTable,
  AddRuleLabelTabs,
} from "components";
import { Paths, formatPath } from "Paths";

import {
  getProjectById,
  getProjectConfiguration,
  getRulesetPathsByConfigurationId,
  getRuleProviderByRulesPathId,
  getAnalysisContext,
  saveAnalysisContext,
  isRulePathBeingUsed,
  deleteRulePathById,
} from "api/api";
import {
  MigrationProject,
  Configuration,
  RulesPath,
  RuleProviderEntity,
  AnalysisContext,
} from "models/api";

import NewProjectWizard from "../";
import { WizardStepIds } from "../new-project-wizard";

interface CustomRulesProps extends RouteComponentProps<{ project: string }> {}

export const CustomRules: React.FC<CustomRulesProps> = ({
  match,
  history: { push },
}) => {
  const drawerRef = React.createRef<any>();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const [tableError, setTableError] = React.useState<string>();
  const [alertError, setAlertError] = React.useState<string>();

  // Project data
  const [project, setProject] = React.useState<MigrationProject>();
  const [isProjectBeingFetched, setIsProjectBeingFetched] = React.useState(
    true
  );

  const [count, setCount] = React.useState(0);

  // Project related data
  const [analysisContext, setAnalysisContext] = React.useState<
    AnalysisContext
  >();
  const [, setConfiguration] = React.useState<Configuration>();
  const [rulesPath, setRulesPath] = React.useState<RulesPath[]>();
  const [ruleProviders, setRuleProviders] = React.useState<
    Map<RulesPath, RuleProviderEntity[]>
  >(new Map());

  const [
    isProjectRelatedDataBeingFetched,
    setIsProjectRelatedDataBeingFetched,
  ] = React.useState(true);

  // Table data
  const [filteredRulesPath, setFilteredRulesPath] = React.useState<RulesPath[]>(
    []
  );
  const [filterText, setFilterText] = React.useState("");
  const [paginationParams, setPaginationParams] = React.useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = React.useState<ISortBy>();
  const [rows, setRows] = React.useState<IRow[]>();

  const columns: ICell[] = [
    { title: "Short path", transforms: [sortable] },
    { title: "Source/Target", transforms: [] },
    { title: "Number of rules", transforms: [] },
    { title: "Enable", transforms: [] },
  ];
  const actions: IActions = [
    // {
    //   title: "View details",
    //   onClick: (_) => {
    //     console.log("View details");
    //   },
    // },
    {
      title: "Delete",
      onClick: (_, rowIndex: number) => {
        const rulePathToDelete: RulesPath = filteredRulesPath[rowIndex];

        isRulePathBeingUsed(rulePathToDelete.id)
          .then(({ data: isRulePathBeingUsed }) => {
            if (!isRulePathBeingUsed) {
              deleteRulePathById(rulePathToDelete.id)
                .then(() => refreshTable())
                .catch(() =>
                  setAlertError("Internal error while deleting RulePath")
                );
            } else {
              setAlertError(
                "The rules path is used in an existing Queued or Running Analysis and cannot be removed."
              );
            }
          })
          .catch(() => {
            setAlertError("Error while checking if RulePath is being used");
          });

        // showDeleteDialog({
        //   name: rulePathToDelete.shortPath || rulePathToDelete.path,
        //   type: "Rule path",
        //   onDelete: () => {
        //     processingDeleteDialog();
        //     isRulePathBeingUsed(rulePathToDelete.id).then(
        //       ({ data: isRulePathBeingUsed }) => {
        //         if (!isRulePathBeingUsed) {
        //           deleteRulePathById(rulePathToDelete.id)
        //             .then(() => {
        //               setCount((current) => current++);
        //             })
        //             .catch(() => {
        //               // addAlert(getDeleteErrorAlertModel("Project"));
        //             })
        //             .finally(() => closeDeleteDialog());
        //         } else {
        //           // addAlert(getDeleteErrorAlertModel("Project"));
        //         }
        //       }
        //     );
        //   },
        //   onCancel: () => {
        //     closeDeleteDialog();
        //   },
        // });
      },
    },
  ];

  // Load migrationProject
  React.useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data }) => setProject(data))
      .catch(() => setTableError("Could not fetch migrationProject data"))
      .finally(() => setIsProjectBeingFetched(false));
  }, [match]);

  // Load analysisContext, Configuration, RulesPath, RuleProviderEntity
  React.useEffect(() => {
    if (project) {
      Promise.all([
        getAnalysisContext(project.defaultAnalysisContextId),
        getProjectConfiguration(project.id),
      ])
        .then(
          ([{ data: analysisContextData }, { data: configurationData }]) => {
            setAnalysisContext(analysisContextData);
            setConfiguration(configurationData);

            return getRulesetPathsByConfigurationId(configurationData.id);
          }
        )
        .then(({ data }) => {
          setRulesPath(data);

          return Promise.all(
            data.map((rulePathElement) =>
              getRuleProviderByRulesPathId(rulePathElement.id).then(
                ({ data: ruleProviderEntities }) => ({
                  rulePath: rulePathElement,
                  ruleProviders: ruleProviderEntities,
                })
              )
            )
          );
        })
        .then((responses) => {
          const map: Map<RulesPath, RuleProviderEntity[]> = new Map();
          responses.forEach((element) =>
            map.set(element.rulePath, element.ruleProviders)
          );
          setRuleProviders(map);
        })
        .catch(() => {
          setTableError(
            "Could not fetch analysisContext, Configuration, RulesPath, or RuleProviderEntity"
          );
        })
        .finally(() => {
          setIsProjectRelatedDataBeingFetched(false);
        });
    }
  }, [project, count]);

  const refreshTable = () => {
    setCount((current) => current + 1);
  };

  const handleOnDrawerToggle = () => {
    setIsDrawerOpen((current) => !current);
    refreshTable();
  };

  const handleRulePathToggled = React.useCallback(
    (isChecked: boolean, rulePathToggled: RulesPath) => {
      const newAnalysisContext: AnalysisContext = {
        ...analysisContext,
      } as AnalysisContext;

      if (isChecked) {
        newAnalysisContext.rulesPaths = [
          ...newAnalysisContext.rulesPaths,
          rulePathToggled,
        ];
      } else {
        newAnalysisContext.rulesPaths = newAnalysisContext.rulesPaths.filter(
          (f) => f.id !== rulePathToggled.id
        );
      }

      saveAnalysisContext(project!.id, newAnalysisContext)
        .then(({ data }) => {
          setAnalysisContext(data);
        })
        .catch(() => {
          console.log("Error saving AnalysisContext");
        });
    },
    [project, analysisContext]
  );

  React.useEffect(() => {
    if (rulesPath) {
      // Sort
      let sortedArray: RulesPath[] = [...rulesPath];

      const columnSortIndex = sortBy?.index;
      const columnSortDirection = sortBy?.direction;

      switch (columnSortIndex) {
        case 0: // title
          sortedArray.sort((a, b) =>
            (a.shortPath || a.path).localeCompare(b.shortPath || b.path)
          );
          break;
      }

      if (columnSortDirection === SortByDirection.desc) {
        sortedArray = sortedArray.reverse();
      }

      // Filter
      const filteredArray = sortedArray.filter(
        (p) => (p.shortPath || p.path).toLowerCase().indexOf(filterText) !== -1
      );

      setFilteredRulesPath(filteredArray);

      const rows: IRow[] = filteredArray.map((item: RulesPath) => {
        const ruleProviderEntity: RuleProviderEntity[] =
          ruleProviders.get(item) || [];

        const sources = ruleProviderEntity.reduce((collection, element) => {
          element.sources.forEach((f) => {
            collection.add(`${f.name}:${f.versionRange}`);
          });
          return collection;
        }, new Set<string>());
        const targets = ruleProviderEntity.reduce((collection, element) => {
          element.targets.forEach((f) => {
            collection.add(`${f.name}:${f.versionRange}`);
          });
          return collection;
        }, new Set<string>());

        const numberOfRules: number = ruleProviderEntity.reduce(
          (counter, element) => counter + element.rules.length,
          0
        );

        return {
          cells: [
            {
              title: item.shortPath || item.path,
            },
            {
              title: `${Array.from(sources.values())}/${Array.from(
                targets.values()
              )}`,
            },
            {
              title: numberOfRules,
            },
            {
              title: (
                <Switch
                  aria-label="Message when on"
                  isChecked={
                    !!analysisContext?.rulesPaths.find((f) => f.id === item.id)
                  }
                  onChange={(isChecked) =>
                    handleRulePathToggled(isChecked, item)
                  }
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
  }, [
    analysisContext,
    rulesPath,
    ruleProviders,
    filterText,
    paginationParams,
    sortBy,
    handleRulePathToggled,
  ]);

  // Wizard handlers

  const handleOnNextStep = () => {
    push(
      formatPath(Paths.newProject_customLabels, {
        project: project?.id,
      })
    );
  };

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
    <NewProjectWizard
      stepId={WizardStepIds.CUSTOM_RULES}
      enableNext={true}
      isDisabled={false}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
    >
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Custom rules
            </Title>
            <Text component="small">
              Upload the rules you want yo include in the analysis
            </Text>
          </TextContent>
        </StackItem>
        {alertError && (
          <StackItem>
            <Alert
              isLiveRegion
              variant="danger"
              title="Error"
              actionClose={
                <AlertActionCloseButton onClose={() => setAlertError("")} />
              }
            >
              {alertError}
            </Alert>
          </StackItem>
        )}
        <StackItem>
          <Drawer
            isExpanded={isDrawerOpen}
            onExpand={() => drawerRef.current && drawerRef.current.focus()}
          >
            <DrawerContent
              panelContent={
                <DrawerPanelContent widths={{ default: "width_75" }}>
                  <DrawerHead>
                    <Title
                      ref={drawerRef}
                      headingLevel="h2"
                      size="xl"
                      tabIndex={isDrawerOpen ? 0 : -1}
                    >
                      Upload rule
                    </Title>
                    {project && (
                      <AddRuleLabelTabs
                        type="Rule"
                        projectId={project.id}
                        onSubmitFinishedServerPath={handleOnDrawerToggle}
                        onCancelServerPath={handleOnDrawerToggle}
                      />
                    )}
                    <DrawerActions>
                      <DrawerCloseButton onClick={handleOnDrawerToggle} />
                    </DrawerActions>
                  </DrawerHead>
                </DrawerPanelContent>
              }
            >
              <DrawerContentBody>
                <Toolbar>
                  <ToolbarContent>
                    <FilterToolbarItem
                      searchValue={filterText}
                      onFilterChange={handlFilterTextChange}
                      placeholder="Filter by name"
                    />
                    <ToolbarGroup variant="button-group">
                      <ToolbarItem>
                        <Button type="button" onClick={handleOnDrawerToggle}>
                          Add rule
                        </Button>
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarItem
                      variant={ToolbarItemVariant.pagination}
                      alignment={{ default: "alignRight" }}
                    >
                      <SimplePagination
                        count={filteredRulesPath.length}
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
                  fetchStatus={
                    isProjectBeingFetched || isProjectRelatedDataBeingFetched
                      ? "inProgress"
                      : "complete"
                  }
                  fetchError={tableError}
                  loadingVariant="skeleton"
                  onSortChange={(sortBy: ISortBy) => {
                    setSortBy(sortBy);
                  }}
                />
                <SimplePagination
                  count={filteredRulesPath.length}
                  params={paginationParams}
                  onChange={handlePaginationChange}
                />
              </DrawerContentBody>
            </DrawerContent>
          </Drawer>

          {/* <Toolbar>
            <ToolbarContent>
              <FilterToolbarItem
                searchValue={filterText}
                onFilterChange={handlFilterTextChange}
                placeholder="Filter by name"
              />
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Link to={Paths.newProject_customRules}>
                    <Button>Add rule</Button>
                  </Link>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarItem
                variant={ToolbarItemVariant.pagination}
                alignment={{ default: "alignRight" }}
              >
                <SimplePagination
                  count={filteredRulesPath.length}
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
            fetchStatus={
              isProjectBeingFetched || isProjectRelatedDataBeingFetched
                ? "inProgress"
                : "complete"
            }
            fetchError={tableError}
            loadingVariant="skeleton"
            onSortChange={(sortBy: ISortBy) => {
              setSortBy(sortBy);
            }}
          />
          <SimplePagination
            count={filteredRulesPath.length}
            params={paginationParams}
            onChange={handlePaginationChange}
          /> */}
        </StackItem>
      </Stack>
    </NewProjectWizard>
  );
};
