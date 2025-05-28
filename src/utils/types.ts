import type { NodeDef, NodeMessage, NodeMessageInFlow } from "node-red";

export type NodeSend = (
	msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>,
) => void;

export type NodeDone = (err?: Error) => void;

export type Listener = (
	msg: NodeMessageInFlow,
	send: NodeSend,
	done: NodeDone,
) => void;

export type WithNodeDef<T> = T & NodeDef;
