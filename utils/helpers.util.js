const gibbyJSON = require('../assets/gibby_quotes.json');
const { italic } = require('@discordjs/builders');

/**
 * @param {string} gameMode The Apex Legends game mode (Battle Royale or Arenas)
 * @param {string} thumbnailUrl Thumbnail image URL
 * @param {string} currentMap Name of the currently active map
 * @param {string} CurrentMapRemainingTimer Remaining time on the currently active map
 * @param {string} currentMapImageUrl Map image URL
 * @param {string} nextMap Name of the next upcoming map
 * @returns Embedded message format type for Discord chat
 */

function createEmbeddedMessage(gameMode, thumbnailUrl, currentMap, currentMapRemainingTimer, currentMapImageUrl, nextMap) {

	const battleRoyale = {
		color: 0x0099ff,
		title: 'Battle Royale',
	};

	const arenas = {
		color: 0xC86A6F,
		title: 'Arenas',
	};

	let game;
	(gameMode == 'Battle Royale') ? game = battleRoyale : game = arenas;

	const embedMessage = {
		color: game.color,
		title: game.title,
		thumbnail: {
			url: thumbnailUrl,
		},
		fields: [
			{
				name: 'Current Map',
				value: currentMap,
				inline: true,
			},
			{
				name: 'Remaining Time',
				value: currentMapRemainingTimer,
				inline: true,
			},
		],
		image: {
			url: currentMapImageUrl,
		},
		footer: {
			text: 'Next map: ' + nextMap,
		},
	};
	return embedMessage;
}

/**
 * Create a Discord TTS message
 * @returns A randomized selection from a list of wholesome quotes,
 * and prepares it into a Discord TTS message format
 */
function createWholesomeGibbyMessage() {
	const RNG = (Math.floor(Math.random() * 10)).toString();
	const wholesomeMessage = italic('"' + gibbyJSON.quotes[RNG].quote + '" - Makoa Gibraltar, 2733');
	const messageTTS = {
		'tts': true,
		'content': wholesomeMessage,
	};
	return messageTTS;
}

module.exports = {
	createEmbeddedMessage,
	createWholesomeGibbyMessage,
};