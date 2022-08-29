const gibbyJSON = require('../assets/gibby_quotes.json');
const { italic } = require('@discordjs/builders');

function hideZeroInTime(time) {

	let timeWithoutZero = time;

	if (time <= '09') {
		timeWithoutZero = time.substring(1, 2);
	}

	return timeWithoutZero;
}

/**
 * Converts the time from format HH:MM:SS to a written format
 * @param {string} time - time in format HH:MM:SS
 * @returns {string} - time in word format i.e. 2 hours, 8 minutes, 1 second
 */
function convertTimer(time) {

	// Only show both digits if value is > 9
	const hoursValue = hideZeroInTime(time.substring(0, 2));
	const minutesValue = hideZeroInTime(time.substring(3, 5));
	const secondsValue = hideZeroInTime(time.substring(6, 8));

	const hourText = 'hour';
	const minuteText = 'minute';
	const secondText = 'second';
	const plural = 's';

	let message = '';
	let messageHour = '';
	let messageMinute = '';
	let messageSecond = '';

	// Fill in Hours
	if (hoursValue !== '0') {
		messageHour = `${hoursValue} ${hourText}`;

		if (hoursValue !== '1') {
			messageHour = `${messageHour}${plural}`;
		}
	}

	// Fill in Minutes
	if (minutesValue !== '0') {
		messageMinute = `${minutesValue} ${minuteText}`;
		if (minutesValue !== '1') {
			messageMinute = `${messageMinute}${plural}`;
		}
	}

	// Fill in Seconds
	if (secondsValue !== '0') {
		messageSecond = `${secondsValue} ${secondText}`;
		if (secondsValue !== '1') {
			messageSecond = `${messageSecond}${plural}`;
		}
	}

	// If hour and message exist, add a space and comma in between
	// If (hour or message) exists and second exists, add a space and comma in between
	let messageHourSuffix = '';
	let messageSecondPrefix = '';

	if (hoursValue !== '0' && minutesValue != '0') {
		messageHourSuffix = ', ';
	}

	if ((hoursValue !== '0' || minutesValue !== '0') && secondsValue !== '0') {
		messageSecondPrefix = ', ';
	}

	message = `${messageHour}${messageHourSuffix}${messageMinute}${messageSecondPrefix}${messageSecond}`;
	return message;
}

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
				value: convertTimer(currentMapRemainingTimer),
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