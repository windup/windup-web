import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from "@patternfly/react-core";
import { PathType, ScopeType } from "models/api";

interface Item {
  label: string;
  type: PathType;
  scope: ScopeType;
}

export interface RulesListProps {
  items: Item[];
}

const filterByScope = (items: Item[], scope: ScopeType) => {
  return items.filter((f) => f.scope === scope);
};

export const RulesLabelsList: React.FC<RulesListProps> = ({ items }) => {
  const [projectScopedItems, setProjectScopedItems] = useState<Item[]>([]);
  const [globalScopedItems, setGlobalScopedItems] = useState<Item[]>([]);

  useEffect(() => {
    setProjectScopedItems(filterByScope(items, "PROJECT"));
    setGlobalScopedItems(filterByScope(items, "GLOBAL"));
  }, [items]);

  return (
    <>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Project scope</DescriptionListTerm>
          <DescriptionListDescription>
            {projectScopedItems.length > 0 ? (
              <List>
                {projectScopedItems.map((item, index) => (
                  <ListItem key={index}>{item.label}</ListItem>
                ))}
              </List>
            ) : (
              "Not defined"
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Global scope</DescriptionListTerm>
          <DescriptionListDescription>
            {globalScopedItems.length > 0 ? (
              <List>
                {globalScopedItems.map((item, index) => (
                  <ListItem key={index}>{item.label}</ListItem>
                ))}
              </List>
            ) : (
              "Not defined"
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};
