import path from "path"
import del from "rollup-plugin-delete"
import postcss from "rollup-plugin-postcss"
import postcssImport from "postcss-import"
import { terser } from "rollup-plugin-terser"
import copy from "rollup-plugin-copy-watch"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import rootImport from "rollup-plugin-root-import"
import alias from "@rollup/plugin-alias"
import webExt from 'web-ext';
import { babel } from '@rollup/plugin-babel'
import globImport from 'rollup-plugin-glob-import'

export default {
	input: "./src/main.js",
	output: {
			file: "./dist/prod/public/bundle.js",
			format: "iife",
	},
	plugins: [
		del({ targets: "dist/prod" }),
		postcss({
			extract: true,
			minimize: true,
			extract: path.resolve("dist/prod/public/bundle.css"),
			plugins: [postcssImport()]
		}),
		copy({
			targets: [{ src: "public", dest: "dist/prod" }, { src: "LICENSE", dest: "dist/prod/public" }, { src: "README.md", dest: "dist/prod/public" }],
			flatten: false
		}),
		nodeResolve(),
		alias({
			entries: [
				{ find:/^lib\/(.*)/, replacement: "./lib/$1" },
				{ find:/^assets\/(.*)/, replacement: "./assets/$1" },
				{ find:/^data\/(.*)/, replacement: "./data/$1" },
				{ find:/^\.env\.js$/, replacement: "./.env.js" }
			]
		}),
		rootImport({
			root: `${__dirname}/src`,
			useInput: "prepend",
			extensions: ".js",
		}),
		globImport(),
		terser(),
		babel({ babelHelpers: 'bundled' }),
		{
			name: 'web-ext',
			generateBundle() {
				webExt.cmd.build({
					sourceDir: path.resolve("dist/prod/public/"),
					filename: "domodel-diary.zip",
					artifactsDir: "build",
					overwriteDest: true
				}, {}).then((extensionRunner) => {});
			}
		}
	]
}
