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
  Tooltip,
} from "@patternfly/react-core";
import {
  ICell,
  sortable,
  IRow,
  ISortBy,
  SortByDirection,
  IActions,
} from "@patternfly/react-table";
import { WarningTriangleIcon } from "@patternfly/react-icons";

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
  getLabelsetPathsByConfigurationId,
  getLabelProviderByLabelsPathId,
  getAnalysisContext,
  saveAnalysisContext,
  isLabelPathBeingUsed,
  deleteLabelPathById,
} from "api/api";
import {
  MigrationProject,
  Configuration,
  LabelsPath,
  LabelProviderEntity,
  AnalysisContext,
} from "models/api";

import NewProjectWizard from "../";
import { WizardStepIds } from "../new-project-wizard";

interface CustomLabelsProps extends RouteComponentProps<{ project: string }> {}

export const CustomLabels: React.FC<CustomLabelsProps> = ({
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
  const [labelsPath, setLabelsPath] = React.useState<LabelsPath[]>();
  const [labelProviders, setLabelProviders] = React.useState<
    Map<LabelsPath, LabelProviderEntity[]>
  >(new Map());

  const [
    isProjectRelatedDataBeingFetched,
    setIsProjectRelatedDataBeingFetched,
  ] = React.useState(true);

  // Table data
  const [filteredLabelsPath, setFilteredLabelsPath] = React.useState<
    LabelsPath[]
  >([]);
  const [filterText, setFilterText] = React.useState("");
  const [paginationParams, setPaginationParams] = React.useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = React.useState<ISortBy>();
  const [rows, setRows] = React.useState<IRow[]>();

  const columns: ICell[] = [
    { title: "Short path", transforms: [sortable] },
    { title: "Number of labels", transforms: [] },
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
        const labelPathToDelete: LabelsPath = filteredLabelsPath[rowIndex];

        isLabelPathBeingUsed(labelPathToDelete.id)
          .then(({ data: isLabelPathBeingUsed }) => {
            if (!isLabelPathBeingUsed) {
              deleteLabelPathById(labelPathToDelete.id)
                .then(() => refreshTable())
                .catch(() =>
                  setAlertError("Internal error while deleting LabelPath")
                );
            } else {
              setAlertError(
                "The labels path is used in an existing Queued or Running Analysis and cannot be removed."
              );
            }
          })
          .catch(() => {
            setAlertError("Error while checking if LabelPath is being used");
          });

        // showDeleteDialog({
        //   name: labelPathToDelete.shortPath || labelPathToDelete.path,
        //   type: "Label path",
        //   onDelete: () => {
        //     processingDeleteDialog();
        //     isLabelPathBeingUsed(labelPathToDelete.id).then(
        //       ({ data: isLabelPathBeingUsed }) => {
        //         if (!isLabelPathBeingUsed) {
        //           deleteLabelPathById(labelPathToDelete.id)
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

  // Load analysisContext, Configuration, LabelsPath, LabelProviderEntity
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

            return getLabelsetPathsByConfigurationId(configurationData.id);
          }
        )
        .then(({ data }) => {
          setLabelsPath(data);

          return Promise.all(
            data.map((labelPathElement) =>
              getLabelProviderByLabelsPathId(labelPathElement.id).then(
                ({ data: labelProviderEntities }) => ({
                  labelPath: labelPathElement,
                  labelProviders: labelProviderEntities,
                })
              )
            )
          );
        })
        .then((responses) => {
          const map: Map<LabelsPath, LabelProviderEntity[]> = new Map();
          responses.forEach((element) =>
            map.set(element.labelPath, element.labelProviders)
          );
          setLabelProviders(map);
        })
        .catch(() => {
          setTableError(
            "Could not fetch analysisContext, Configuration, LabelsPath, or LabelProviderEntity"
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

  const handleLabelPathToggled = React.useCallback(
    (isChecked: boolean, labelPathToggled: LabelsPath) => {
      const newAnalysisContext: AnalysisContext = {
        ...analysisContext,
      } as AnalysisContext;

      if (isChecked) {
        newAnalysisContext.labelsPaths = [
          ...newAnalysisContext.labelsPaths,
          labelPathToggled,
        ];
      } else {
        newAnalysisContext.labelsPaths = newAnalysisContext.labelsPaths.filter(
          (f) => f.id !== labelPathToggled.id
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
    if (labelsPath) {
      // Sort
      let sortedArray: LabelsPath[] = [...labelsPath];

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

      setFilteredLabelsPath(filteredArray);

      const rows: IRow[] = filteredArray.map((item: LabelsPath) => {
        const labelProviderEntity: LabelProviderEntity[] =
          labelProviders.get(item) || [];

        const numberOfLabels: number = labelProviderEntity.reduce(
          (counter, element) => counter + element.labels.length,
          0
        );

        const errors: string[] = labelProviderEntity.reduce(
          (array, element) =>
            element.loadError ? [...array, element.loadError] : array,
          [] as string[]
        );

        return {
          cells: [
            {
              title: (
                <React.Fragment>
                  {errors.length > 0 && (
                    <Tooltip content={<div>{errors.join(",")}</div>}>
                      <span>
                        <WarningTriangleIcon />
                        &nbsp;
                      </span>
                    </Tooltip>
                  )}
                  <span>{item.shortPath || item.path}</span>
                </React.Fragment>
              ),
            },
            {
              title: numberOfLabels,
            },
            {
              title: (
                <Switch
                  aria-label="Enabled"
                  isChecked={
                    !!analysisContext?.labelsPaths.find((f) => f.id === item.id)
                  }
                  onChange={(isChecked) =>
                    handleLabelPathToggled(isChecked, item)
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
    labelsPath,
    labelProviders,
    filterText,
    paginationParams,
    sortBy,
    handleLabelPathToggled,
  ]);

  // Wizard handlers

  const handleOnNextStep = () => {
    push(
      formatPath(Paths.newProject_advandedOptions, {
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
      stepId={WizardStepIds.CUSTOM_LABELS}
      enableNext={true}
      disableNavigation={false}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
    >
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Custom labels
            </Title>
            <Text component="small">
              Upload the labels you want yo include in the analysis
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
                      Upload label
                    </Title>
                    {project && (
                      <AddRuleLabelTabs
                        type="Label"
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
                          Add label
                        </Button>
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarItem
                      variant={ToolbarItemVariant.pagination}
                      alignment={{ default: "alignRight" }}
                    >
                      <SimplePagination
                        count={filteredLabelsPath.length}
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
                  count={filteredLabelsPath.length}
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
                  <Link to={Paths.newProject_customLabels}>
                    <Button>Add label</Button>
                  </Link>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarItem
                variant={ToolbarItemVariant.pagination}
                alignment={{ default: "alignRight" }}
              >
                <SimplePagination
                  count={filteredLabelsPath.length}
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
            count={filteredLabelsPath.length}
            params={paginationParams}
            onChange={handlePaginationChange}
          /> */}
        </StackItem>
      </Stack>
    </NewProjectWizard>
  );
};
