import { createStore, createHook, StoreActionApi } from "react-sweet-state";
import { NodeType, Node, NodeCollection } from "./types";

/**
 * The node store contains arbitrary data organised into a hierarchy. A single node has an 'id', a 'type',
 * some user-defined data, and a 'parentId'. The 'parentId' can be undefined, in which case the node is a
 * root node. Parent and child nodes can be retrieved for a given node via the selectors.
 *
 * The driving motivation for the nodeStore was to model the state in the massing configurator. A node would
 * store the data for a single massing, such as a tower, podium or site. And the hierarchy determines which
 * massings belong to which. For instance a tower node may be a child of a podium node.
 *
 * References to children and parent for each node are managed internally to protect integrity.
 * The store should only be mutated by the `setNode` and `deleteNode` actions defined.
 */
export type NodeStoreState = {
  nodes: NodeCollection;
};
const initialState: NodeStoreState = {
  nodes: {}
};

export type NodeStoreApi = StoreActionApi<NodeStoreState>;
const actions = {
  /**
   * Nodes are both created and updated by this function. The store will automatically manage the internal
   * parent/child references depending on the parentId specified.
   * @param node Data node to store. If one already exists for the given id it will be updated. Otherwise one will be created.
   * @param parentId Optional parent for this node. If none is specified then it is a root node.
   */
  setNode: (node: Node<NodeType, any>, parentId?: string) => ({ setState, getState }: NodeStoreApi) => {
    const nodes = getState().nodes;

    const prevNode = nodes[node.id];

    const prevParentNode = prevNode?.parentId ? nodes[prevNode.parentId] : undefined;
    const nextParentNode = parentId ? nodes[parentId] : undefined;

    const updatedNodes: NodeCollection = {};
    updatedNodes[node.id] = { ...node, parentId, childrenIds: prevNode?.childrenIds ?? [] };

    if (prevParentNode !== nextParentNode) {
      if (prevParentNode) {
        updatedNodes[prevParentNode.id] = {
          ...prevParentNode,
          childrenIds: prevParentNode.childrenIds.filter((id) => id !== node.id)
        };
      }

      if (nextParentNode) {
        updatedNodes[nextParentNode.id] = { ...nextParentNode, childrenIds: [...nextParentNode.childrenIds, node.id] };
      }
    }

    setState({
      nodes: {
        ...nodes,
        ...updatedNodes
      }
    });
  },
  /**
   * Removes the node of the given id from the store. Any children will have their 'parentId' set to undefined
   * and become root nodes.
   * @param nodeId id for the node to delete.
   */
  deleteNode: (nodeId: string) => ({ setState, getState }: NodeStoreApi) => {
    const nodes = getState().nodes;
    const node = nodes[nodeId];
    if (node === undefined) {
      return;
    }

    const parentNode = node.parentId ? nodes[node.parentId] : undefined;
    const childNodes = node.childrenIds.map((id) => nodes[id]);

    const updatedNodes: NodeCollection = { ...nodes };
    delete updatedNodes[nodeId];

    if (parentNode) {
      updatedNodes[parentNode.id] = {
        ...parentNode,
        childrenIds: parentNode.childrenIds.filter((id) => id !== nodeId)
      };
    }

    for (const childNode of childNodes) {
      updatedNodes[childNode.id] = { ...childNode, parentId: undefined };
    }

    setState({
      nodes: updatedNodes
    });
  }
};
export type NodeStoreActions = typeof actions;

export const NodeStore = createStore<NodeStoreState, NodeStoreActions>({
  initialState,
  actions,
  name: "Node Store"
});

export const useNodeStore = createHook(NodeStore);
