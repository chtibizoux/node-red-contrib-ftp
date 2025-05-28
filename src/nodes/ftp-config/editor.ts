import { registerEditor } from "../../utils/editor";
import type { FTPConfigProps, FTPConfigCreds } from "./types";

registerEditor<FTPConfigProps, FTPConfigCreds>({
	category: "config",
	color: "BurlyWood",
	defaults: {
		name: { value: "" },
		host: { value: "" },
		port: { value: "" },
		secure: { value: false },
		user: { value: "" },
		connTimeout: { value: "" },
		pasvTimeout: { value: "" },
		keepalive: { value: "" },
	},
	credentials: {
		password: { type: "password" },
	},
	label: function () {
		return this.name || this.host;
	},
});
