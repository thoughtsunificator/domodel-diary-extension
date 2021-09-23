import path from 'path'
import assert from "assert"
import puppeteer from 'puppeteer'

let browser
let page

beforeEach(async () => {
	try {
		const pathToExtension = path.resolve("dist/prod/public");
		browser = await puppeteer.launch({
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
			]
		});
		page = await browser.newPage();
	} catch(error) {
		console.error(error)
	}
})

afterEach(async () => {
	await browser.close()
})
