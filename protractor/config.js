const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
require('dotenv').config();

exports.config = {
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	capabilities: {
		'browserName': 'chrome',
		chromeOptions: {
			args: [
				'--start-maximized',
			],
		},
	},
	specs: ['./specs/commands-spec.js'],
	resultJsonOutputFile: './results/testResults.json',


	onPrepare: async function () {

		const testCredentials = {
			username: process.env.DISCORD_USERNAME,
			password: process.env.DISCORD_PASSWORD,
			server: process.env.DISCORD_SERVER,
		};

		jasmine.getEnv().addReporter(
			new SpecReporter({
				spec: {
					displayStacktrace: true,
				},
			}),
		);

		// Go to server page and be prompted with login page
		await browser.waitForAngularEnabled(false);
		await browser.get(testCredentials.server);

		// Elements
		const inpEmailField = browser.driver.findElement(by.css('[name="email"]'));
		const inpPasswordField = browser.driver.findElement(by.css('[name="password"]'));
		const btnLogin = browser.driver.findElement(by.css('button[type="submit"]'));

		// Enter credentials and sign in
		await inpEmailField.sendKeys(testCredentials.username);
		await inpPasswordField.sendKeys(testCredentials.password);
		await btnLogin.click();
	},
};