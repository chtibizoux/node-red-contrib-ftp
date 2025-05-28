import { registerEditor } from "../../utils/editor";
import type { FTPClientProps } from "./types";

registerEditor<FTPClientProps>({
	category: "storage-input",
	color: "BurlyWood",
	defaults: {
		ftp: { value: "", type: "ftp-config", required: true },
		operation: { value: "list", required: true },
		filename: { value: "" },
		localFilename: { value: "" },
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
		const filename = $(".input-filename-row");
		const localFilename = $(".input-localFilename-row");

		$("#node-input-operation").on("change", () => {
			const id = $("#node-input-operation option:selected").val();

			if (id === "put" || id === "get" || id === "append") {
				filename.show();
				localFilename.show();
			} else {
				filename.show();
				localFilename.hide();
			}
		});
	},
});
