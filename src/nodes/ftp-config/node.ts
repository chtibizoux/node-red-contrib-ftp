import type { NodeAPI } from "node-red";
import { NodeWraper, registerNode } from "../../utils/node";
import type { WithNodeDef } from "../../utils/types";
import type { FTPConfigCreds, FTPConfigProps } from "./types";

class FtpConfigNode extends NodeWraper<FTPConfigProps, FTPConfigCreds> {
	public options: Omit<FTPConfigProps, "name"> & FTPConfigCreds;

	constructor(RED: NodeAPI, config: WithNodeDef<FTPConfigProps>) {
		super(RED, config);

		const credentials = this.getCredentials();

		this.name = config.name;

		this.options = {
			host: config.host || "localhost",
			port: config.port || 21,
			secure: config.secure || false,
			user: config.user || "anonymous",
			password: credentials.password || "anonymous@",
			connTimeout: config.connTimeout || 10000,
			pasvTimeout: config.pasvTimeout || 10000,
			keepalive: config.keepalive || 10000,
		};
	}
}

export type { FtpConfigNode };

export default registerNode(FtpConfigNode);
