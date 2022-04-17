/* eslint-disable no-undef */
'use strict';

const Login = require('../pages/login.js');
const Chat = require('../pages/chat.js');
const { browser } = require('protractor');
const { env } = require('process');

describe('Discord Server Apex Bot', function () {

	// Specs
	it('Slash Command - Check /map command prompt text', async function () {
		const td = {
			username: process.env.DISCORD_USERNAME,
			password: process.env.DISCORD_PASSWORD,
			expectedPromptText: '/map\nReplies with APEX map rotation info, bruddah',
		};

		// Get Apex Server page
		await Login.getPage();
		await Login.signInLoginPage(td.username, td.password);

		// Enter slash command
		const divMessageInput = $('[aria-label="Message #apex-bot-js-dev"]');
		const until = protractor.ExpectedConditions;
		await browser.wait(until.presenceOf(divMessageInput), 5000, 'Element taking too long to appear in the DOM');
		await divMessageInput.sendKeys('/map');

		const listSlashCommands = $('[role="listbox"] [aria-label="Apex Bot"]');
		const EC = protractor.ExpectedConditions;
		expect(await browser.wait(EC.visibilityOf(listSlashCommands))).toBe(true);

		// Wait for and verify command prompt text
		const divSlashPromptMap = $('[role="listbox"] #autocomplete-0 div div div:nth-of-type(2)');
		expect(await divSlashPromptMap.getText()).toBe(td.expectedPromptText);


		browser.driver.sleep(5000);
	});
});