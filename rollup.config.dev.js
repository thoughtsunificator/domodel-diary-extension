import path from "path"
import postcss from "rollup-plugin-postcss"
import postcssImport from "postcss-import"
import copy from "rollup-plugin-copy-watch"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import alias from "@rollup/plugin-alias"
import rootImport from "rollup-plugin-root-import"
import livereload from "rollup-plugin-livereload"
import webExt from 'web-ext'
import globImport from 'rollup-plugin-glob-import'

export default {
	input: "./src/main.js",
	output: {
		file: "./dist/dev/public/bundle.js",
		format: "iife",
		sourcemap: true
	},
	plugins: [
		postcss({
			sourceMap: true,
			extract: path.resolve("dist/dev/public/bundle.css"),
			plugins: [postcssImport()]
		}),
		copy({
			watch: 'public',
			targets: [{ src: "public", dest: "dist/dev" }, { src: "LICENSE", dest: "dist/dev/public" }, { src: "README.md", dest: "dist/dev/public" }],
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
		livereload('dist/dev/public'),
		{
			name: 'web-ext',
			generateBundle() {
				webExt.cmd.run({
					target: ['chromium'],
					sourceDir: path.resolve("dist/dev/public/"),
				}, {}).then((extensionRunner) => {});
			}
		}
	]
}
