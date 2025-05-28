import type { Node, NodeAPI, NodeCredentials, NodeSettings } from "node-red";
import type { WithNodeDef } from "./types";

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: Node-RED's createNode adds Node methods at runtime
export abstract class NodeWraper<
	TProps extends {} = object,
	TCreds extends {} = object,
> {
	protected RED: NodeAPI;
	protected config: WithNodeDef<TProps>;

	constructor(RED: NodeAPI, config: WithNodeDef<TProps>) {
		this.RED = RED;
		this.config = config;

		RED.nodes.createNode(this, config);
	}

	protected getCredentials() {
		return this.RED.nodes.getCredentials(this.config.id) as TCreds;
	}
}

export interface NodeWraper<TProps extends {}, TCreds extends {}>
	extends Node<TCreds> {}

type NodeWraperConstructor<
	TNode extends NodeWraper<TProps, TCred>,
	TProps extends {},
	TCred extends {},
> = new (RED: NodeAPI, nodeDef: WithNodeDef<TProps>) => TNode;

declare const __NAME__: string;

export function registerNode<
	TNode extends NodeWraper<TProps, TCreds>,
	TProps extends {},
	TSets,
	TCreds extends {},
>(
	nodeConstructor: NodeWraperConstructor<TNode, TProps, TCreds>,
	opts?: {
		credentials?: NodeCredentials<TCreds> | undefined;
		settings?: NodeSettings<TSets> | undefined;
	},
) {
	return (RED: NodeAPI) => {
		RED.nodes.registerType<TNode, WithNodeDef<TProps>, TSets, TCreds>(
			__NAME__,
			function (nodeDef) {
				nodeConstructor.call(this, RED, nodeDef);
			},
			opts,
		);
	};
}
