const helpers = require('../utils/helpers.util.js');
const request = require('request');
require('dotenv').config({ path: '../.env' });
const config = require('../configs/general.config.js');
const GIBBY_LAUGH = 'https://lh3.googleusercontent.com/pw/AM-JKLVGx1ZWfcDVTgCVCEAZ2ks1e-grT6oO2rEZ4LWWK5B6ZTLwV0wl3iCg9Nx068KfLrncH3aL2q5rxkshX913QMc0zeRd16g-VJpljzI8amJbpPwnICrSCSchC9QKMQott6UaHXJGVnaUbttOWC6pRMnq2Q=w1022-h466-no?authuser=0';

const url = config.APEX_API_URL + config.APEX_API_TOKEN;

async function sendChannelMessage(hook, message, isSlashCommand) {

	if (isSlashCommand) {
		await hook.reply(message);
	}
	else {
		await hook.channel.send(message);
	}
}

async function getCurrentMap(hook, isSlashCommand) {

	request.get(url, async function(error, response, body) {
		if (!error && response.statusCode === 200) {
			const mapData = JSON.parse(body);

			// Battle Royale Data
			const brData = mapData.battle_royale;
			const brCurrentMap = brData.current.map;
			// const brCurrentMapRemainingMinutes = brData.current.remainingMins;
			const brCurrentMapRemainingTimer = brData.current.remainingTimer;
			const brCurrentMapImage = brData.current.asset;
			const brNextMap = brData.next.map;

			// Arenas Data
			const arenaData = mapData.arenas;
			const arenasCurrentMap = arenaData.current.map;
			// const arenasCurrentMapRemainingMinutes = arenaData.current.remainingMins;
			const arenasCurrentMapRemainingTimer = arenaData.current.remainingTimer;
			const areansCurrentMapImage = arenaData.current.asset;
			const arenasNextMap = arenaData.next.map;

			// Construct Messages
			const embedBattleRoyaleMessage = helpers.createEmbeddedMessage('Battle Royale', GIBBY_LAUGH, brCurrentMap,
				brCurrentMapRemainingTimer, brCurrentMapImage, brNextMap);
			const embedArenasMessage = helpers.createEmbeddedMessage('Arenas', GIBBY_LAUGH, arenasCurrentMap,
				arenasCurrentMapRemainingTimer, areansCurrentMapImage, arenasNextMap);
			const message = { embeds: [embedBattleRoyaleMessage, embedArenasMessage] };

			// Send messages
			await sendChannelMessage(hook, message, isSlashCommand);
		}
	});
}

module.exports = {
	getCurrentMap,
	sendChannelMessage,
};