import * as React from "react";
import { AngleRightIcon, AngleDownIcon } from "@patternfly/react-icons";

import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import { Checkbox } from "@material-ui/core";

import { Package } from "../../models/api";
import { useTreeSelectionState } from "../../hooks/useTreeSelectionState";

export interface PackageSelectionProps {
  packages: Package[];
  onChange: (checked: Package[]) => void;
}

const packageToTree = (node: Package): any => {
  return {
    node,
    children: node.childs.map((f) => packageToTree(f)),
  };
};

export const PackageSelection: React.FC<PackageSelectionProps> = ({
  packages,
}) => {
  const { toggleNodeSelected, getNodeStatus } = useTreeSelectionState<Package>({
    tree: packages.map((f) => packageToTree(f)),
    isEqual: (a, b) => a.id === b.id,
  });

  const renderTree = (nodes: Package[]) => {
    return nodes.map((element) => {
      const nodeStatus = getNodeStatus(element);
      return (
        <TreeItem
          key={element.id}
          nodeId={element.id.toString()}
          label={
            <React.Fragment>
              <Checkbox
                color="default"
                checked={nodeStatus === "checked" ? true : false}
                indeterminate={nodeStatus === "indeterminate" ? true : false}
              />
              {element.name}
            </React.Fragment>
          }
          onLabelClick={(event) => {
            event.preventDefault();
            toggleNodeSelected(element);
          }}
        >
          {renderTree(element.childs)}
        </TreeItem>
      );
    });
  };

  return (
    <React.Fragment>
      <TreeView
        defaultCollapseIcon={<AngleDownIcon />}
        defaultExpandIcon={<AngleRightIcon />}
      >
        {renderTree(packages)};
      </TreeView>
    </React.Fragment>
  );
};
