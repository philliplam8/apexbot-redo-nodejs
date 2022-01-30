const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const request = require('request');
require('dotenv').config();
const { Client, Intents, MessageEmbed, MessageFlags } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const GIBBY_LAUGH = 'https://lh3.googleusercontent.com/pw/AM-JKLVGx1ZWfcDVTgCVCEAZ2ks1e-grT6oO2rEZ4LWWK5B6ZTLwV0wl3iCg9Nx068KfLrncH3aL2q5rxkshX913QMc0zeRd16g-VJpljzI8amJbpPwnICrSCSchC9QKMQott6UaHXJGVnaUbttOWC6pRMnq2Q=w1022-h466-no?authuser=0';

// Environment Variables
const PORT = process.env.PORT || 5000;
const APEX_API_TOKEN = process.env.APEX_LEGENDS_API_TOKEN;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Regex
const pattern = /sad/i;

const app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

// Apex API GET Requests ------------------------------------------------------
let mapData = '';
let mapMessage = 'not started';


// Setting the configuration for the request
const url = 'https://api.mozambiquehe.re/maprotation?version=2&auth=' + APEX_API_TOKEN;

function getCurrentMap() {

	request.get(url, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			mapData = JSON.parse(body);

			// Battle Royale Data
			const brData = mapData.battle_royale;
			const brCurrentMap = brData.current.map;
			const brCurrentMapRemainingMinutes = brData.current.remainingMins;
			const brCurrentMapRemainingTimer = brData.current.remainingTimer;
			const brCurrentMapImage = brData.current.asset;
			const brNextMap = brData.next.map;

			// Arenas Data
			const arenaData = mapData.arenas;
			const arenasCurrentMap = arenaData.current.map;
			const arenasCurrentMapRemainingMinutes = arenaData.current.remainingMins;
			const arenasCurrentMapRemainingTimer = arenaData.current.remainingTimer;
			const areansCurrentMapImage = arenaData.current.asset;
			const arenasNextMap = arenaData.next.map;

			// Construct Message
			const battleRoyaleMessage = '**Battle Royale:**\nThe current map is **' + brCurrentMap + '** for the next **' + brCurrentMapRemainingMinutes + '** minutes.\nThe next map is **' + brNextMap + '** bruddas.';
			const arenasMessage = '\n\n**Arenas:**\nThe current map is **' + arenasCurrentMap + '** for the next **' + arenasCurrentMapRemainingMinutes + '** minutes.\nThe next map is **' + arenasNextMap + '**.';
			mapMessage = battleRoyaleMessage + arenasMessage;

			const embedBattleRoyaleMessage = {
				color: 0x0099ff,
				title: 'Battle Royale',
				fields: [
					{
						name: 'Current Map',
						value: brCurrentMap,
						inline: true,
					},
					{
						name: 'Remaining time',
						value: brCurrentMapRemainingTimer,
						inline: true,
					},
				],
				image: {
					url: brCurrentMapImage,
				},
				footer: {
					text: 'Next map: ' + brNextMap,
				},
			};

			const embedArenasMessage = {
				color: 0x0099ff,
				title: 'Arenas',
				fields: [
					{
						name: 'Current Map',
						value: arenasCurrentMap,
						inline: true,
					},
					{
						name: 'Remaining time',
						value: arenasCurrentMapRemainingTimer,
						inline: true,
					},
				],
				image: {
					url: areansCurrentMapImage,
				},
				footer: {
					text: 'Next map: ' + arenasNextMap,
				},
			};

			embedDemo = new MessageEmbed()
				.setColor('0x0099ff')
				.setTitle('Battle Royale');

			return;
		}
	});
}

app.get('', async (req, res) => {
	res.send('I\'m up!');
});

app.get('/apex', async (_, res) => {
	getCurrentMap();
	res.send(mapData);
	res.end();
});


// Discord Client -------------------------------------------------------------

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Login to Discord with your client's token
client.login(DISCORD_TOKEN);

// client is an instance of Discord.Client
client.on('messageCreate', async (message) => {

	getCurrentMap();
	// Check if content of message is "!ping"
	if (message.content == '!ping') {
		// Call .send() on the channel object the message was sent in
		message.channel.send('pong!');
	}

	if (message.content == '!test') {
		request.get(url, function(error, response, body) {
			if (!error && response.statusCode === 200) {

				getCurrentMap();

				// TODO: add a promise here to wait until getCurrentMap is updated before message is sent
				message.channel.send(mapMessage);
			}
		});
	}

	if (message.content == '!map') {
		request.get(url, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				mapData = JSON.parse(body);

				// Battle Royale Data
				const brData = mapData.battle_royale;
				const brCurrentMap = brData.current.map;
				const brCurrentMapRemainingMinutes = brData.current.remainingMins;
				const brCurrentMapRemainingTimer = brData.current.remainingTimer;
				const brCurrentMapImage = brData.current.asset;
				const brNextMap = brData.next.map;

				// Arenas Data
				const arenaData = mapData.arenas;
				const arenasCurrentMap = arenaData.current.map;
				const arenasCurrentMapRemainingMinutes = arenaData.current.remainingMins;
				const arenasCurrentMapRemainingTimer = arenaData.current.remainingTimer;
				const areansCurrentMapImage = arenaData.current.asset;
				const arenasNextMap = arenaData.next.map;

				// Construct Message
				const battleRoyaleMessage = '**Battle Royale:**\nThe current map is **' + brCurrentMap + '** for the next **' + brCurrentMapRemainingMinutes + '** minutes.\nThe next map is **' + brNextMap + '** bruddas.';
				const arenasMessage = '\n\n**Arenas:**\nThe current map is **' + arenasCurrentMap + '** for the next **' + arenasCurrentMapRemainingMinutes + '** minutes.\nThe next map is **' + arenasNextMap + '**.';
				mapMessage = battleRoyaleMessage + arenasMessage;

				const embedBattleRoyaleMessage = {
					color: 0x0099ff,
					title: 'Battle Royale',
					thumbnail: {
						url: GIBBY_LAUGH,
					},
					fields: [
						{
							name: 'Current Map',
							value: brCurrentMap,
							inline: true,
						},
						{
							name: 'Remaining Time',
							value: brCurrentMapRemainingTimer,
							inline: true,
						},
					],
					image: {
						url: brCurrentMapImage,
					},
					footer: {
						text: 'Next map: ' + brNextMap,
					},
				};

				const embedArenasMessage = {
					color: 0xC86A6F,
					title: 'Arenas',
					fields: [
						{
							name: 'Current Map',
							value: arenasCurrentMap,
							inline: true,
						},
						{
							name: 'Remaining Time',
							value: arenasCurrentMapRemainingTimer,
							inline: true,
						},
					],
					image: {
						url: areansCurrentMapImage,
					},
					footer: {
						text: 'Next map: ' + arenasNextMap,
					},
				};

				message.channel.send({ embeds: [embedBattleRoyaleMessage, embedArenasMessage] });
			}
		});

	}

	// Using regex, check all cases for text "sad"
	if (pattern.test(message.content)) {
		const gibbyJSON = require('./assets/gibby_quotes.json');
		const RNG = (Math.floor(Math.random() * 10)).toString();
		const wholesomeMessage = blockQuote(gibbyJSON.quotes[RNG].quote);
		message.reply(wholesomeMessage);
	}
});

// Create a server and listen to it.
app.listen(PORT, () => {
	console.log(`Application is live and listening on port ${PORT}`);
});