import React, { useCallback, useEffect, useState } from "react";

import {
  Bullseye,
  Button,
  Modal,
  ModalVariant,
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
  AddRuleLabelTabs,
  CustomEmptyState,
  RulelabelTitle,
  TableSectionOffline,
} from "components";
import { useDeleteRule } from "hooks/useDeleteRule";
import { useFetchRules } from "hooks/useFetchRules";
import { useShowRuleLabelDetails } from "hooks/useShowRuleLabelDetails";

import { RuleProviderEntity, RulesPath } from "models/api";
import {
  getErrorsFromRuleProviderEntity,
  getNumberOfRulesFromRuleProviderEntity,
  getSourcesFromRuleProviderEntity,
  getTargetsFromRuleProviderEntity,
} from "utils/modelUtils";

const RULEPATH_FIELD = "rulePath";

const columns: ICell[] = [
  { title: "Short path", transforms: [sortable] },
  { title: "Source", transforms: [] },
  { title: "Target", transforms: [] },
  { title: "Number of rules", transforms: [] },
];

const compareFn = (a: RulesPath, b: RulesPath, columnIndex?: number) => {
  switch (columnIndex) {
    case 0: // Short path
      return (a.shortPath || a.path).localeCompare(b.shortPath || b.path);
    default:
      return 0;
  }
};

const filterFn = (filterText: string, rulePath: RulesPath) => {
  return (
    (rulePath.shortPath || rulePath.path)
      .toLowerCase()
      .indexOf(filterText.toLowerCase()) !== -1
  );
};

export const UserProvided: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProvidedRulesPath, setUserProvidedRulesPath] = useState<
    RulesPath[]
  >();

  const deleteRule = useDeleteRule();
  const showRuleLabelDetails = useShowRuleLabelDetails();

  const {
    rulesPath,
    ruleProviders,
    isFetching: isFetchingRules,
    fetchError: fetchRulesError,
    loadGlobalRules,
  } = useFetchRules();

  useEffect(() => {
    if (rulesPath) {
      const newUserProvidedRulesPath = rulesPath
        .filter((f) => f.rulesPathType === "USER_PROVIDED")
        .sort((a, b) =>
          (a.shortPath || a.path).localeCompare(b.shortPath || b.path)
        );
      setUserProvidedRulesPath(newUserProvidedRulesPath);
    }
  }, [rulesPath]);

  useEffect(() => {
    loadGlobalRules();
  }, [loadGlobalRules]);

  const actionResolver = (rowData: IRowData): (IAction | ISeparator)[] => {
    const row: RulesPath = getRowRulePathField(rowData);
    const ruleProviderEntity = ruleProviders?.get(row.id) || [];
    const numberOfRules = getNumberOfRulesFromRuleProviderEntity(
      ruleProviderEntity
    );

    const viewDetailsAction: IAction = {
      title: "View details",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: RulesPath = getRowRulePathField(rowData);
        const providerEntity = ruleProviders?.get(row.id) || [];

        showRuleLabelDetails("Rule", row, providerEntity);
      },
    };

    return [
      ...(numberOfRules > 0 ? [viewDetailsAction] : []),
      {
        title: "Delete",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const row: RulesPath = getRowRulePathField(rowData);
          deleteRule(row, () => loadGlobalRules());
        },
      },
    ];
  };

  const areActionsDisabled = (): boolean => {
    return false;
  };

  const getRowRulePathField = (rowData: IRowData): RulesPath => {
    return rowData[RULEPATH_FIELD];
  };

  const toIRowFn = useCallback(
    (rulePaths: RulesPath[]): IRow[] => {
      return rulePaths.map((item) => {
        const ruleProviderEntity: RuleProviderEntity[] =
          ruleProviders?.get(item.id) || [];

        const sources = getSourcesFromRuleProviderEntity(ruleProviderEntity);
        const targets = getTargetsFromRuleProviderEntity(ruleProviderEntity);

        const numberOfRules = getNumberOfRulesFromRuleProviderEntity(
          ruleProviderEntity
        );
        const errors = getErrorsFromRuleProviderEntity(ruleProviderEntity);

        return {
          [RULEPATH_FIELD]: item,
          cells: [
            {
              title: (
                <RulelabelTitle
                  name={item.shortPath || item.path}
                  errors={errors}
                  numberOfRulesLabels={numberOfRules}
                />
              ),
            },
            {
              title: Array.from(sources.values()).join(", "),
            },
            {
              title: Array.from(targets.values()).join(", "),
            },
            {
              title: numberOfRules,
            },
          ],
        };
      });
    },
    [ruleProviders]
  );

  const handleModalToggle = () => {
    setIsModalOpen((current) => {
      if (current) {
        loadGlobalRules();
      }
      return !current;
    });
  };

  const handleOnRuleLabelClose = () => {
    setIsModalOpen((current) => !current);
    loadGlobalRules();
  };

  return (
    <>
      <TableSectionOffline
        items={userProvidedRulesPath}
        columns={columns}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
        loadingVariant="skeleton"
        isLoadingData={isFetchingRules}
        loadingDataError={fetchRulesError}
        compareItem={compareFn}
        filterItem={filterFn}
        mapToIRow={toIRowFn}
        toolbar={
          <ToolbarGroup variant="button-group">
            <ToolbarItem>
              <Button type="button" onClick={handleModalToggle}>
                Add rule
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        }
        emptyState={
          <Bullseye>
            <CustomEmptyState
              icon={CubesIcon}
              title="No custom rules available"
              body="Upload a custom rule by clicking on 'Add rule'"
            />
          </Bullseye>
        }
      />
      <Modal
        variant={ModalVariant.medium}
        title="Add rules"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <AddRuleLabelTabs
          type="Rule"
          onSubmitFinishedServerPath={handleOnRuleLabelClose}
          onCancelServerPath={handleOnRuleLabelClose}
        />
      </Modal>
    </>
  );
};
