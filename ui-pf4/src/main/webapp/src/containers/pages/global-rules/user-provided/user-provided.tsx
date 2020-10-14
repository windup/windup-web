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
  IActions,
  ICell,
  IRow,
  IRowData,
  sortable,
} from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import {
  AddRuleLabelTabs,
  CustomEmptyState,
  TableSectionOffline,
} from "components";
import { useDeleteRule } from "hooks/useDeleteRule";
import { useFetchRules } from "hooks/useFetchRules";

import { RuleProviderEntity, RulesPath } from "models/api";
import { getTechnologyAsString } from "utils/modelUtils";

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

  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: RulesPath = rowData[RULEPATH_FIELD];
        deleteRule(row, () => loadGlobalRules());
      },
    },
  ];

  const toIRowFn = useCallback(
    (rulePaths: RulesPath[]): IRow[] => {
      return rulePaths.map((item) => {
        const ruleProviderEntity: RuleProviderEntity[] =
          ruleProviders?.get(item) || [];

        const sources = ruleProviderEntity.reduce((collection, element) => {
          element.sources.forEach((f) => {
            collection.add(getTechnologyAsString(f));
          });
          return collection;
        }, new Set<string>());
        const targets = ruleProviderEntity.reduce((collection, element) => {
          element.targets.forEach((f) => {
            collection.add(getTechnologyAsString(f));
          });
          return collection;
        }, new Set<string>());

        const numberOfRules: number = ruleProviderEntity.reduce(
          (counter, element) => counter + element.rules.length,
          0
        );

        return {
          [RULEPATH_FIELD]: item,
          cells: [
            {
              title: item.shortPath || item.path,
            },
            {
              title: Array.from(sources.values()),
            },
            {
              title: Array.from(targets.values()),
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
        items={userProvidedRulesPath || []}
        columns={columns}
        actions={actions}
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
