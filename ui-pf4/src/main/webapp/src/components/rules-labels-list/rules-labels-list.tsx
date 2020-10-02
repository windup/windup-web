import * as React from "react";
import {
  List,
  ListItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from "@patternfly/react-core";

export type PathType = "SYSTEM_PROVIDED" | "USER_PROVIDED";
export type ScopeType = "GLOBAL" | "PROJECT";

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
  const [projectScopedItems, setProjectScopedItems] = React.useState<Item[]>(
    []
  );
  const [globalScopedItems, setGlobalScopedItems] = React.useState<Item[]>([]);

  React.useEffect(() => {
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
