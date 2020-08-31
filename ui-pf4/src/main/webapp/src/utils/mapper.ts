import { Package } from "../models/api";

export const packageToNode = (
  pack: Package
): { label: string; value: any; children: any[] } => {
  return {
    label: pack.name,
    value: pack,
    children: pack.childs.map((f) => packageToNode(f)),
  };
};
