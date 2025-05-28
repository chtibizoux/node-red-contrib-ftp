import type { Options } from "ftp";

export interface FTPConfigProps extends Omit<Required<Options>, "password" | "debug" | "secureOptions"> {
	name: string;
}

export interface FTPConfigCreds {
	password: string;
}
