export type NodeType = string;

/*
An example of the intended way to create concrete instances of a Node:

type PodiumNode = Node<"Podium", PodiumDataObjectType>

// `isPodiumNode` is a type predicate function: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
const isPodiumNode = (node?: UnknownNode): node is PodiumNode => node?.type === "Podium";

// Lets retrieve all podium nodes from the store
const [nodes] = useNodes();
const podiumNodes = nodes.filter(isPodiumNode);
// When we filter by `isPodiumNode` typescript will recognise the returned type is `PodiumNode[]` instead of `UnknownNode[]`
*/
export interface Node<T extends NodeType, K> {
  id: string;
  data: K;
  type: T;
}

export type UnknownNode = Node<NodeType, unknown>;

// Internal representation of node where store maintains references to parent/children. Not to be used outside
// of store actions.
export interface ManagedNode extends UnknownNode {
  parentId?: string;
  childrenIds: string[];
}

export type NodeCollection = { [id: string]: ManagedNode };
