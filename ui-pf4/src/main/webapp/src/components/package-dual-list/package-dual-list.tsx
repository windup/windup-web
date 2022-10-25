import React, { useEffect, useState } from "react";
import { Bullseye } from "@patternfly/react-core";

import { Transfer, Tree } from "antd";
import "antd/lib/transfer/style/index.css";
import "antd/lib/tree/style/index.css";

import { Package } from "models/api";

const TRANSFER_TREE_HEIGHT = 400;

interface TreeNode {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

const packageToTree = (node: Package): TreeNode => {
  return {
    key: node.fullName,
    title: node.name,
    icon: undefined,
    // icon: node.known ? <ThinkPeaksIcon /> : undefined,
    children:
      node.childs && node.childs.length > 0
        ? node.childs.map((f) => packageToTree(f))
        : undefined,
  };
};

export interface PackageDualListProps {
  isDisabled: boolean;
  packages: Package[];
  includedPackages: string[];
  onChange: (includedPackages: string[]) => void;
}

const isChecked = (selectedKeys: string[], eventKey: string) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (
  treeNodes: TreeNode[] = [],
  checkedKeys: string[] = []
): any => {
  return treeNodes
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((i: TreeNode) => ({
      ...i,
      disabled:
        checkedKeys.includes(i.key) ||
        checkedKeys.some((f) => i.key.startsWith(f + ".")),
      children: generateTree(i.children, checkedKeys),
    }));
};

const stringCompartor = (a: string, b: string) => a.localeCompare(b);

export const PackageDualList: React.FC<PackageDualListProps> = ({
  isDisabled,
  packages,
  includedPackages,
  onChange,
}) => {
  const [processing, setProcessing] = useState(true);

  const [packagesTree, setPackagesTree] = useState<TreeNode[]>();
  const [packagesTreeFlattened, setPackagesTreeFlattened] = useState<
    TreeNode[]
  >();

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    const newTargetKeys = [...includedPackages].sort(stringCompartor);

    setTargetKeys(newTargetKeys);

    // Create tree
    const newPackagesTree = packages.map((f) => packageToTree(f));
    setPackagesTree(newPackagesTree);

    // Create flattern tree
    const newPackagesTreeFlattened: TreeNode[] = [];
    const flatten = (list: TreeNode[] = []) => {
      list.forEach((item) => {
        newPackagesTreeFlattened.push(item);
        flatten(item.children);
      });
    };
    flatten(newPackagesTree);
    setPackagesTreeFlattened(newPackagesTreeFlattened);

    // Stop processing signal
    setProcessing(false);
  }, [packages, includedPackages]);

  const handleTransferChange = (keys: string[]) => {
    const keysFlatterned = keys.filter((keyToEliminate) => {
      return !keys.some((i) => keyToEliminate.startsWith(i + "."));
    });

    const newTargetKeys = keysFlatterned.sort(stringCompartor);
    setTargetKeys(newTargetKeys);

    // Emit event
    onChange(newTargetKeys);
  };

  return (
    <>
      {processing ? (
        <Bullseye>
          <span>Processing...</span>
        </Bullseye>
      ) : (
        <Transfer
          titles={["Packages", "Included packages"]}
          dataSource={packagesTreeFlattened}
          render={(item) => item.key}
          showSelectAll={true}
          onChange={handleTransferChange}
          targetKeys={targetKeys} // A set of keys of elements that are listed on the right column
          listStyle={{
            height: TRANSFER_TREE_HEIGHT + 40, // We need to add the size of the header
          }}
          disabled={isDisabled}
        >
          {({ direction, onItemSelect, selectedKeys }) => {
            if (direction === "left") {
              const checkedKeys = [...selectedKeys, ...targetKeys];
              return (
                <Tree
                  virtual={false}
                  height={TRANSFER_TREE_HEIGHT}
                  blockNode // Whether treeNode fill remaining horizontal space
                  checkable // Add a Checkbox before the treeNodes
                  checkStrictly // Check treeNode precisely; parent treeNode and children treeNodes are not associated
                  defaultExpandAll={false} // Whether to expand all treeNodes by default
                  checkedKeys={selectedKeys} // Specifies the keys of the checked treeNodes
                  treeData={generateTree(packagesTree, targetKeys)}
                  onCheck={(_, { node: { key } }) => {
                    onItemSelect(
                      key as any,
                      !isChecked(checkedKeys, key as any)
                    );
                  }}
                  onSelect={(_, { node: { key } }) => {
                    onItemSelect(
                      key as any,
                      !isChecked(checkedKeys, key as any)
                    );
                  }}
                  titleRender={(node) => (
                    <span>
                      {node.title}{" "}
                      <small>
                        <i>{node.icon}</i>
                      </small>
                    </span>
                  )}
                  disabled={isDisabled}
                />
              );
            }
          }}
        </Transfer>
      )}
    </>
  );
};
