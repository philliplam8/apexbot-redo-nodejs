'use strict';

class Chat {
	constructor() {

		// Elements
		this.divMessageInput = $('[aria-label="Message #apex-bot-js-dev"]');
		this.listSlashCommands = $('[data-list-id="channel-autocomplete"]');

		// Functions

		/**
		 * Type a slash command into the chat input field
		 * @param {string} command slash command
		 */
		this.enterSlashCommand = async function enterSlashCommand(command) {
			const until = protractor.ExpectedConditions;
			await browser.wait(until.presenceOf(this.divMessageInput), 5000, 'Element taking too long to appear in the DOM');
			await this.divMessageInput.sendKeys(command);
		};

	}
}
module.exports = new Chat();