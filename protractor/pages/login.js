'use strict';
require('dotenv').config();

class Login {
	constructor() {

		// Constants
		this.server = process.env.DISCORD_SERVER;

		// Elements
		this.inpEmailField = $('[name="email"]');
		this.inpPasswordField = $('[name="password"]');
		this.btnLogin = $('button[type="submit"]');

		// Functions
		/**
		 * Get this login page
		 */
		this.getPage = async function getPage() {
			// Get Apex Server page
			await browser.waitForAngularEnabled(false);
			await browser.get(this.server);
		};

		/**
		 * Enter the username and password values, then log in
		 * @param {string} username Discord Username value
		 * @param {string} password Discord Password value
		 */
		this.signInLoginPage = async function signInLoginPage(username, password) {

			// Enter credentials and sign in
			await this.inpEmailField.sendKeys(username);
			await this.inpPasswordField.sendKeys(password);
			await this.btnLogin.click();
		};
	}
}

module.exports = new Login();