import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import fs from "node:fs/promises";
import { minify } from "html-minifier-terser";
import pkg from "./package.json" with { type: "json" };

const BUILD_DIR = "dist";

const files = await fs.readdir("src/nodes", { withFileTypes: true });

await fs.rm(BUILD_DIR, { recursive: true, force: true });

await fs.mkdir(BUILD_DIR, { recursive: true });

const nodes = [];
for (const file of files) {
	if (file.isDirectory()) {
		buildJsFile(file.name);
		buildHtmlFile(file.name);
		nodes.push(file.name);
	}
}

const packageJson = structuredClone(pkg);

packageJson.devDependencies = undefined;
packageJson.scripts = undefined;
packageJson["node-red"] = {
	nodes: nodes.reduce((acc, node) => {
		acc[node] = `${node}.js`;
		return acc;
	}, {}),
};

await fs.writeFile(`${BUILD_DIR}/package.json`, JSON.stringify(packageJson));

await fs.cp("locales", `${BUILD_DIR}/locales`, { recursive: true });

async function buildJsFile(name) {
	const bundle = await rollup({
		input: `src/nodes/${name}/node.ts`,
		external: [
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.peerDependencies || {}),
		],
		plugins: [
			resolve(),
			replace({
				__NAME__: JSON.stringify(name),
				preventAssignment: true,
			}),
			typescript({
				tsconfig: "./tsconfig.json",
			}),
			terser(),
		],
	});

	await bundle.write({
		file: `${BUILD_DIR}/${name}.js`,
		format: "cjs",
	});
}

async function buildHtmlFile(name) {
	const [helpContent, templateContent, jsContent] = await Promise.all([
		generateHTMLFile(`src/nodes/${name}/help.html`),
		generateHTMLFile(`src/nodes/${name}/template.html`),
		generateEditorFile(name),
	]);

	const htmlContent =
		`<script type="text/x-red" data-help-name="${name}">${helpContent.trim()}</script>` +
		`<script type="text/x-red" data-template-name="${name}">${templateContent.trim()}</script>` +
		`<script type="text/javascript">${jsContent.trim()}</script>`;

	await fs.writeFile(`${BUILD_DIR}/${name}.html`, htmlContent);
}

async function generateHTMLFile(path) {
	const content = await fs.readFile(path, "utf8");
	return await minify(content, {
		collapseWhitespace: true,
		removeComments: true,
		minifyCSS: true,
	});
}

async function generateEditorFile(name) {
	const bundle = await rollup({
		input: `src/nodes/${name}/editor.ts`,
		plugins: [
			resolve(),
			replace({
				__NAME__: JSON.stringify(name),
				preventAssignment: true,
			}),
			typescript({
				tsconfig: "./tsconfig.json",
			}),
			terser(),
		],
	});

	const { output } = await bundle.generate({
		format: "iife",
	});

	return output[0].code;
}
