/* eslint-disable no-undef */
'use strict';

const Login = require('../pages/login.js');
const Chat = require('../pages/chat.js');
const { browser, protractor } = require('protractor');
const { env } = require('process');

describe('Discord Server Apex Bot', function () {

	// Specs
	it('Slash Command - Check /map slash command text', async function () {
		const td = {
			slashCommand: '/map',
			expectedPromptText: '/map\nReplies with APEX map rotation info, bruddah',
		};

		// Enter slash command
		await Chat.enterSlashCommand(td.slashCommand);

		const EC = protractor.ExpectedConditions;
		expect(await browser.wait(EC.visibilityOf(Chat.listSlashCommands))).toBe(true);

		// Wait for and verify command prompt text
		const divSlashPromptMap = $('[role="listbox"] #autocomplete-0 div div div:nth-of-type(2)');
		expect(await divSlashPromptMap.getText()).toBe(td.expectedPromptText);
		// await browser.sleep(5000);
	});

	it('Slash Command - Use /map slash command', async function () {
		const td = {
			slashCommand: '/map',
		};

		// Clear chat input field
		await Chat.divMessageInput.clear();

		// Enter slash command
		await Chat.enterSlashCommand(td.slashCommand);

		// Click on the suggested slash command prompt

		// Hit the Enter key to select slash command
		await Chat.divMessageInput.sendKeys(protractor.Key.ARROW_UP);
		await Chat.divMessageInput.sendKeys(protractor.Key.ENTER);

		// Hit the Enter key again to send the slash command
		await Chat.divMessageInput.sendKeys(protractor.Key.ENTER);
		// await browser.sleep(5000);
	});

});