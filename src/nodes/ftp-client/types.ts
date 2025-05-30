export interface FTPClientProps {
	ftp: string;
	operation: "list" | "get" | "put" | "append" | "delete" | "mkdir";
	filename: string;
	localFilename: string;
	name: string;
	output: "file" | "string";
	encoding:
		| "ascii"
		| "utf-8"
		| "utf-16le"
		| "ucs-2"
		| "latin1"
		| "base64"
		| "base64url"
		| "hex";
}
