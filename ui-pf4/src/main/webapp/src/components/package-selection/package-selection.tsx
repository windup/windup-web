import * as React from "react";
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from "@patternfly/react-core";
import {
  AngleRightIcon,
  AngleDownIcon,
  InfoIcon,
  CircleNotchIcon,
} from "@patternfly/react-icons";

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
  onChange,
}) => {
  const {
    toggleNodeSelected,
    getNodeStatus,
    selectedNodes,
  } = useTreeSelectionState<Package>({
    tree: packages.map((f) => packageToTree(f)),
    isEqual: (a, b) => a.id === b.id,
  });

  const handleToggleNode = (event: React.MouseEvent, node: Package) => {
    event.preventDefault();
    toggleNodeSelected(node);

    // Emit change event
    onChange(selectedNodes);
  };

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
              <i>{element.known ? <CircleNotchIcon /> : null}</i>
              {element.name}
            </React.Fragment>
          }
          onLabelClick={(event) => {
            handleToggleNode(event, element);
          }}
        >
          {renderTree(element.childs)}
        </TreeItem>
      );
    });
  };

  return (
    <React.Fragment>
      {packages.length > 0 ? (
        <TreeView
          defaultCollapseIcon={<AngleDownIcon />}
          defaultExpandIcon={<AngleRightIcon />}
        >
          {renderTree(packages)}
        </TreeView>
      ) : (
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon icon={InfoIcon} />
          <Title headingLevel="h4" size="lg">
            No packages
          </Title>
          <EmptyStateBody>There are no packages to show</EmptyStateBody>
        </EmptyState>
      )}
    </React.Fragment>
  );
};
