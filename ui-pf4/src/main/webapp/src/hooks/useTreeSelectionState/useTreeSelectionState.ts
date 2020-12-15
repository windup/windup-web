import React, { useState } from "react";

export interface ITreeNode<T> {
  node: T;
  children: ITreeNode<T>[];
}

export interface ITreeSelectionStateArgs<T> {
  tree: ITreeNode<T>[];
  initialSelected?: T[];
  isEqual?: (a: T, b: T) => boolean;
}

export interface ITreeSelectionState<T> {
  selectedNodes: T[];
  isNodeSelected: (node: T) => boolean;
  getNodeStatus: (node: T) => "checked" | "unchecked" | "indeterminate";
  toggleNodeSelected: (node: T, isSelecting?: boolean) => void;
  areAllSelected: boolean;
  selectAll: (isSelecting?: boolean) => void;
  setSelectedNodes: (nodes: T[]) => void;
}

const searchTreeNode = <T>(
  tree: ITreeNode<T>[],
  node: T,
  isEqual: (a: T, b: T) => boolean
) => {
  let treeNode: ITreeNode<T> | undefined = undefined;
  for (let i = 0; i < tree.length; i++) {
    treeNode = getTreeNode(tree[i], node, isEqual);
    if (treeNode) {
      break;
    }
  }
  return treeNode;
};

const getTreeNode = <T>(
  treeNode: ITreeNode<T>,
  matchingNode: T,
  isEqual: (a: T, b: T) => boolean
): ITreeNode<T> | undefined => {
  if (isEqual(treeNode.node, matchingNode)) {
    return treeNode;
  } else {
    let result = undefined;
    for (let i = 0; i < treeNode.children.length; i++) {
      result = getTreeNode(treeNode.children[i], matchingNode, isEqual);
      if (result) {
        break;
      }
    }
    return result;
  }
};

const getAllChildren = <T>(treeNode: ITreeNode<T>): T[] => {
  return treeNode.children.reduce(
    (previous: T[], current: ITreeNode<T>) => [
      ...previous,
      current.node,
      ...getAllChildren(current),
    ],
    []
  );
};

const getAllParents = <T>(
  node: ITreeNode<T>,
  tree: Map<ITreeNode<T>, ITreeNode<T> | undefined>
) => {
  const result: T[] = [];

  let parent = tree.get(node);
  while (parent) {
    result.push(parent.node);
    parent = tree.get(parent);
  }

  return result;
};

export const useTreeSelectionState = <T>({
  tree,
  initialSelected = [],
  isEqual = (a, b) => a === b,
}: ITreeSelectionStateArgs<T>): ITreeSelectionState<T> => {
  const treeNodeParentsMap: Map<
    ITreeNode<T>,
    ITreeNode<T> | undefined
  > = new Map();
  const initMaps = (
    nodes: ITreeNode<T>[],
    parentNode: ITreeNode<T> | undefined = undefined
  ) => {
    nodes.forEach((child) => {
      treeNodeParentsMap.set(child, parentNode);
      if (child.children && child.children.length > 0) {
        initMaps(child.children, child);
      }
    });
  };
  initMaps(tree);

  const [selectedNodes, setSelectedNodes] = useState<T[]>(initialSelected);

  const isNodeSelected = (node: T) =>
    selectedNodes.some((i) => isEqual(node, i));

  const getNodeStatus = (
    node: T
  ): "checked" | "unchecked" | "indeterminate" => {
    if (isNodeSelected(node)) {
      return "checked";
    } else {
      const treeNode: ITreeNode<T> | undefined = searchTreeNode(
        tree,
        node,
        isEqual
      );
      if (treeNode) {
        const allChildren = getAllChildren(treeNode);
        if (allChildren.some((f) => isNodeSelected(f))) {
          return "indeterminate";
        }
      }
    }
    return "unchecked";
  };

  const toggleNodeSelected = (node: T, isSelecting = !isNodeSelected(node)) => {
    const treeNode: ITreeNode<T> | undefined = searchTreeNode(
      tree,
      node,
      isEqual
    );
    if (!treeNode) {
      throw new Error("Tree node not found");
    }

    let newSelectedNodes: T[];

    if (isSelecting) {
      newSelectedNodes = [...selectedNodes, node, ...getAllChildren(treeNode)];

      // If all children checked then parent should be checked too
      const addParentIfAllChildrenChecked = (treeNode: ITreeNode<T>) => {
        const parent = treeNodeParentsMap.get(treeNode);
        if (parent) {
          const everyChildrenIsChecked = parent.children.every((i) =>
            newSelectedNodes.some((j) => isEqual(i.node, j))
          );
          if (everyChildrenIsChecked) {
            newSelectedNodes = [...newSelectedNodes, parent.node]; // remove parent
            addParentIfAllChildrenChecked(parent);
          }
        }
      };
      addParentIfAllChildrenChecked(treeNode);
    } else {
      const listToRemove = [
        node,
        ...getAllChildren(treeNode),
        ...getAllParents(treeNode, treeNodeParentsMap),
      ];
      newSelectedNodes = selectedNodes.filter(
        (i) => !listToRemove.some((j) => isEqual(i, j))
      );
    }

    setSelectedNodes(newSelectedNodes);
  };

  const selectAll = (isSelecting = true) =>
    setSelectedNodes(isSelecting ? tree.map((f) => f.node) : []);
  const areAllSelected = tree.every((f) => isNodeSelected(f.node));

  // Preserve original order of items
  let selectedItemsInOrder: T[] = [];
  if (areAllSelected) {
    selectedItemsInOrder = tree.map((f) => f.node);
  } else if (selectedNodes.length > 0) {
    selectedItemsInOrder = tree.map((f) => f.node).filter(isNodeSelected);
  }

  return {
    selectedNodes: selectedItemsInOrder,
    isNodeSelected: isNodeSelected,
    getNodeStatus: getNodeStatus,
    toggleNodeSelected: toggleNodeSelected,
    areAllSelected,
    selectAll,
    setSelectedNodes: setSelectedNodes,
  };
};
