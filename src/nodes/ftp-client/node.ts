import type { NodeAPI, NodeMessageInFlow } from "node-red";
import { NodeWraper, registerNode } from "../../utils/node";
import type { Listener, WithNodeDef } from "../../utils/types";
import type { FTPClientProps } from "./types";
import FtpClient from "ftp";
import type { FtpConfigNode } from "../ftp-config/node";
import fs from "node:fs";

class FtpClientNode extends NodeWraper<FTPClientProps> {
	ftpNode: FtpConfigNode;

	constructor(RED: NodeAPI, config: WithNodeDef<FTPClientProps>) {
		super(RED, config);

		this.ftpNode = RED.nodes.getNode(this.config.ftp) as FtpConfigNode;

		if (this.ftpNode) {
			this.on("input", this.onInput);
		} else {
			this.error("missing ftp configuration");
		}
	}

	onInput: Listener = (msg, send, done) => {
		const conn = new FtpClient();
		const filename =
			this.config.filename ||
			(typeof msg.filename === "string" && msg.filename) ||
			"";
		const localFilename =
			this.config.localFilename ||
			(typeof msg.localFilename === "string" && msg.localFilename) ||
			"";

		const sendSuccess = (payload: unknown) => {
			this.status({});
			msg.payload = payload;
			msg.filename = filename;
			msg.localFilename = localFilename;

            if (send) {
                send(msg);
            } else {
                this.send(msg);
            }
			if (done) {
				done();
			}
		};

		const sendError = (error: Error) => {
			this.status({ fill: "red", shape: "ring", text: "failed" });
            if (done) {
                done(error);
            } else {
                this.error(error, msg);
            }
		};

		conn.on("ready", () => {
			switch (this.config.operation) {
				case "list":
					conn.list(filename, (error, listing) => {
						conn.end();
						if (error) {
							sendError(error);
							return;
						}

						sendSuccess(listing);
					});
					break;
				case "get":
					conn.get(filename, (error, stream) => {
						if (error) {
							conn.end();
							sendError(error);
							return;
						}
						stream.once("close", () => {
							conn.end();
							sendSuccess(`Get operation successful. ${localFilename}`);
						});
						stream.pipe(fs.createWriteStream(localFilename));
					});
					break;
				case "put":
					conn.put(localFilename, filename, (error) => {
						conn.end();
						if (error) {
							sendError(error);
							return;
						}
						sendSuccess("Put operation successful.");
					});
					break;
				case "append":
					conn.append(localFilename, filename, (error) => {
						conn.end();
						if (error) {
							sendError(error);
							return;
						}
						sendSuccess("Append operation successful.");
					});
					break;
				case "delete":
					conn.delete(filename, (error) => {
						conn.end();
						if (error) {
							sendError(error);
							return;
						}
						sendSuccess("Delete operation successful.");
					});
					break;
				case "mkdir":
					conn.mkdir(filename, true, (error) => {
						conn.end();
						if (error) {
							sendError(error);
							return;
						}
						sendSuccess("Make directory operation successful.");
					});
					break;
			}
		});

		conn.on("error", (error) => {
			// conn.end();
			sendError(error);
		});

		conn.connect(this.ftpNode.options);
	};
}

export default registerNode(FtpClientNode);
