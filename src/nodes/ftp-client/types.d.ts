export interface FTPClientProps {
	ftp: string;
	operation: "list" | "get" | "put" | "append" | "delete" | "mkdir";
	filename: string;
	localFilename: string;
	name: string;
}
