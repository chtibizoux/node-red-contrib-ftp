import { registerEditor } from "../../utils/editor";
import type { FTPClientProps } from "./types";

registerEditor<FTPClientProps>({
	category: "storage-input",
	color: "BurlyWood",
	defaults: {
		ftp: { value: "", type: "ftp-config", required: true },
		output: { value: "file", required: true },
		operation: { value: "list", required: true },
		filename: { value: "" },
		localFilename: { value: "" },
		encoding: { value: "utf-8", required: true },
		name: { value: "" },
	},
	inputs: 1,
	outputs: 1,
	icon: "file.png",
	label: function () {
		return this.name || "ftp";
	},
	labelStyle: function () {
		return this.name ? "node_label_italic" : "";
	},
	oneditprepare: () => {
		const outputSelect = $("#node-input-output");
		const operationSelect = $("#node-input-operation");

		const outputRow = $("#input-output-row");
		const encodingRow = $("#input-encoding-row");
		const localFilenameRow = $("#input-localFilename-row");

		function updateUI() {
			const operation = operationSelect.val();
			const outputType = outputSelect.val();

			if (operation === "get") {
				outputRow.show();
			} else {
				outputRow.hide();
			}
			if (operation === "get" && outputType === "string") {
				encodingRow.show();
			} else {
				encodingRow.hide();
			}
			if (
				(operation === "get" && outputType === "file") ||
				operation === "put" ||
				operation === "append"
			) {
				localFilenameRow.show();
			} else {
				localFilenameRow.hide();
			}
		}

		outputSelect.on("change", updateUI);
		operationSelect.on("change", updateUI);
	},
});
