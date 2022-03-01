import { createHook } from "react-sweet-state";
import { NodeStoreState, NodeStore } from "./nodeStore";
import { UnknownNode, ManagedNode } from "./types";

/**
 * Hookless getter functions. Most will take nodeId as possibly undefined. This is intentional for
 * chaining together hooks where a previous hook didnt find a node.
 */
export const getNodes = (state: NodeStoreState): UnknownNode[] => Object.values(state.nodes);

export const getNode = (state: NodeStoreState, nodeId: string | undefined): UnknownNode | undefined =>
  nodeId ? state.nodes[nodeId] : undefined;

export const getParent = (state: NodeStoreState, nodeId: string | undefined): UnknownNode | undefined => {
  const node = getNode(state, nodeId) as ManagedNode;
  return getNode(state, node?.parentId);
};

export const getAncestors = (state: NodeStoreState, nodeId: string | undefined): UnknownNode[] => {
  const parents: UnknownNode[] = [];
  let curr = getNode(state, nodeId);
  while ((curr = getParent(state, curr?.id))) {
    parents.push(curr);
  }
  return parents;
};

export const getChildren = (state: NodeStoreState, nodeId: string | undefined): UnknownNode[] => {
  const node = getNode(state, nodeId) as ManagedNode;
  const childrenIds = node?.childrenIds ?? [];
  return childrenIds.map((x) => state.nodes[x]);
};

export const getChildrenRecursive = (state: NodeStoreState, nodeId: string | undefined): UnknownNode[] => {
  const node = getNode(state, nodeId) as ManagedNode;
  if (node === undefined) {
    return [];
  }

  const children: UnknownNode[] = getChildren(state, nodeId);
  for (let i = 0; i < children.length; i++) {
    // Breadth-First ordering
    children.push(...getChildren(state, children[i].id));
  }

  return children;
};

/**
 * Hook selector functions
 */
export const useNode = createHook(NodeStore, {
  selector: getNode
});

export const useNodes = createHook(NodeStore, {
  selector: getNodes
});

export const useNodeParent = createHook(NodeStore, {
  selector: getParent
});

export const useNodeAncestors = createHook(NodeStore, {
  selector: getAncestors
});

export const useNodeChildren = createHook(NodeStore, {
  selector: getChildren
});

export const useNodeChildrenRecursive = createHook(NodeStore, {
  selector: getChildrenRecursive
});
