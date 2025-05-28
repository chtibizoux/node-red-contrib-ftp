import type { EditorNodeDef, EditorNodeProperties, EditorRED } from "node-red";

declare const RED: EditorRED;
declare const __NAME__: string;

export function registerEditor<
	TProps extends EditorNodeProperties,
	TCreds = undefined,
	TInstProps extends TProps = TProps,
>(def: EditorNodeDef<TProps, TCreds, TInstProps>) {
	RED.nodes.registerType(__NAME__, def);
}
