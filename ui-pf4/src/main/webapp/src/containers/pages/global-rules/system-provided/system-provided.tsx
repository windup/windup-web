import React, { useCallback, useEffect, useState } from "react";

import {
  Bullseye,
  Checkbox,
  Select,
  SelectOption,
  SelectVariant,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { IActions, ICell, IRow, sortable } from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import { CustomEmptyState, TableSectionOffline } from "components";
import { useFetchRules } from "hooks/useFetchRules";

import { RuleProviderEntity, RulesPath } from "models/api";
import { getTechnologyAsString } from "utils/modelUtils";

const RULE_PROVIDER_ENTITY_FIELD = "rulePath";

const columns: ICell[] = [
  { title: "Provider ID", transforms: [sortable] },
  { title: "Source", transforms: [] },
  { title: "Target", transforms: [] },
  { title: "Number of rules", transforms: [sortable] },
];

const compareRulePath = (
  a: RuleProviderEntity,
  b: RuleProviderEntity,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 0: // Provider ID
      return a.providerID.localeCompare(b.providerID);
    case 3: // Number of rules
      return a.rules.length - b.rules.length;
    default:
      return 0;
  }
};

const filterRulePath = () => {
  return true;
};

const getRuleProviderEntities = (
  rulesPath?: RulesPath[],
  ruleProviders?: Map<RulesPath, RuleProviderEntity[]>
) => {
  const systemProvidedRulesPath = rulesPath?.find(
    (f) => f.rulesPathType === "SYSTEM_PROVIDED"
  );
  if (systemProvidedRulesPath) {
    return ruleProviders?.get(systemProvidedRulesPath);
  }
};

const getAllTechnologyVersions = (
  ruleProviderEntities: RuleProviderEntity[],
  type: "target" | "source"
) => {
  return ruleProviderEntities.reduce((map, item) => {
    let technologies = item.targets;
    if (type === "target") {
      technologies = item.targets;
    } else if (type === "source") {
      technologies = item.sources;
    } else {
      throw new Error("Expected 'source' or 'target'");
    }

    technologies.forEach((technology) => {
      let versions: string[] = [];
      if (technology.versionRange && technology.versionRange.length > 0) {
        versions = technology.versionRange
          //eslint-disable-next-line
          .replace(/[(\[\])]/g, "")
          .split(",")
          .filter((version) => version !== "");
      }

      const newVersions = new Set(map.get(technology.name));
      versions.forEach((f) => newVersions.add(f));

      map.set(technology.name, newVersions);
    });

    return map;
  }, new Map<string, Set<string>>());
};

export const SystemProvided: React.FC = () => {
  const [tableData, setTableData] = useState<RuleProviderEntity[]>();
  const [showAllRules, setShowAllRules] = useState(false);

  const {
    rulesPath,
    ruleProviders,
    isFetching,
    fetchError,
    loadGlobalRules,
  } = useFetchRules();

  useEffect(() => {
    loadGlobalRules();
  }, [loadGlobalRules]);

  useEffect(() => {
    if (rulesPath && ruleProviders) {
      const newTableData = getRuleProviderEntities(rulesPath, ruleProviders)
        ?.filter((f) => {
          return showAllRules ? true : f.phase === "MIGRATIONRULESPHASE";
        })
        .slice()
        .sort((a, b) => {
          return a.providerID.localeCompare(b.providerID);
        });

      setTableData(newTableData);
    }
  }, [rulesPath, ruleProviders, showAllRules]);

  const actions: IActions = [];

  const rulePathToIRow = useCallback(
    (ruleProviderEntity: RuleProviderEntity[]): IRow[] => {
      return ruleProviderEntity.map((item) => {
        return {
          props: {
            [RULE_PROVIDER_ENTITY_FIELD]: item,
          },
          cells: [
            {
              title: item.providerID,
            },
            {
              title: item.sources
                .map((f) => getTechnologyAsString(f))
                .join(", "),
            },
            {
              title: item.targets
                .map((f) => getTechnologyAsString(f))
                .join(", "),
            },
            {
              title: item.rules.length,
            },
          ],
        };
      });
    },
    []
  );

  const toggleShowAllRules = (selected: boolean) => {
    setShowAllRules(selected);
  };

  return (
    <TableSectionOffline
      items={tableData || []}
      columns={columns}
      actions={actions}
      loadingVariant="skeleton"
      isLoadingData={isFetching || !tableData}
      loadingDataError={fetchError}
      compareItem={compareRulePath}
      filterItem={filterRulePath}
      mapToIRow={rulePathToIRow}
      toolbar={
        <>
          {tableData && (
            <SourceTargetFilterToolbarGroup ruleProviders={tableData} />
          )}
          <ToolbarGroup variant="icon-button-group">
            <ToolbarItem>
              <Checkbox
                id="showAllRules"
                name="showAllRules"
                label="Show all rules"
                isChecked={showAllRules}
                onChange={toggleShowAllRules}
                aria-label="show all rules"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </>
      }
      emptyState={
        <Bullseye>
          <CustomEmptyState
            icon={CubesIcon}
            title="No sytem provided rules available"
            body="Make sure your server contains system provided rules"
          />
        </Bullseye>
      }
    />
  );
};

export interface SourceTargetFilterToolbarGroupProps {
  ruleProviders: RuleProviderEntity[];
}

export const SourceTargetFilterToolbarGroup: React.FC<SourceTargetFilterToolbarGroupProps> = ({
  ruleProviders,
}) => {
  const [targets] = useState(getAllTechnologyVersions(ruleProviders, "target"));
  const [sources] = useState(getAllTechnologyVersions(ruleProviders, "source"));

  console.log(targets);
  console.log(sources);
  //

  const [firstFilterValue, setFirstFilterValue] = useState("target");
  const [isFirstFilterOpen, setIsFirstFilterOpen] = useState(false);

  const onFirstFilterToggle = (isExpanded: boolean) => {
    setIsFirstFilterOpen(isExpanded);
  };
  const onFirstFilterSelect = (_: any, selection: any) => {
    setFirstFilterValue(selection);
    setIsFirstFilterOpen(false);
  };

  //

  const [secondFilterValue, setSecondFilterValue] = useState<string[]>([]);
  const [isSecondFilterOpen, setIsSecondFilterOpen] = useState(false);

  const onSecondFilterToggle = (isExpanded: boolean) => {
    setIsSecondFilterOpen(isExpanded);
  };
  const onSecondFilterSelect = (_: any, selection: any) => {
    if (secondFilterValue.includes(selection)) {
      setSecondFilterValue((current) => current.filter((f) => f !== selection));
    } else {
      setSecondFilterValue((current) => [...current, selection]);
    }
  };
  const onSecondFilter_Filter = (evt: any) => {
    // if (textInput === "") {
    //   return this.options;
    // } else {
    //   let filteredGroups = this.options
    //     .map((group) => {
    //       let filteredGroup = React.cloneElement(group, {
    //         children: group.props.children.filter((item) => {
    //           return item.props.value
    //             .toLowerCase()
    //             .includes(textInput.toLowerCase());
    //         }),
    //       });
    //       if (filteredGroup.props.children.length > 0) return filteredGroup;
    //     })
    //     .filter((newGroup) => newGroup);
    //   return filteredGroups;
    // }

    return [];
  };
  const onSecondFilterClearSelection = () => {
    setSecondFilterValue([]);
  };

  return (
    <ToolbarGroup variant="filter-group">
      <ToolbarItem>
        <Select
          variant={SelectVariant.single}
          aria-label="Select Filter"
          onToggle={onFirstFilterToggle}
          onSelect={onFirstFilterSelect}
          selections={firstFilterValue}
          isOpen={isFirstFilterOpen}
        >
          {[
            <SelectOption key="source" value="source" />,
            <SelectOption key="target" value="target" />,
          ]}
        </Select>
      </ToolbarItem>
      <ToolbarItem>
        <Select
          variant={SelectVariant.checkbox}
          onToggle={onSecondFilterToggle}
          onSelect={onSecondFilterSelect}
          selections={secondFilterValue}
          isOpen={isSecondFilterOpen}
          placeholderText="Filter by status"
          aria-labelledby="Filter by status"
          onFilter={onSecondFilter_Filter}
          onClear={onSecondFilterClearSelection}
          isGrouped
          hasInlineFilter
          customBadgeText="carlos feria"
        >
          {[]}
        </Select>
      </ToolbarItem>
    </ToolbarGroup>
  );
};
