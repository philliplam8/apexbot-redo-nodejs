const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const request = require('request');
require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { italic } = require('@discordjs/builders');
const GIBBY_LAUGH = 'https://lh3.googleusercontent.com/pw/AM-JKLVGx1ZWfcDVTgCVCEAZ2ks1e-grT6oO2rEZ4LWWK5B6ZTLwV0wl3iCg9Nx068KfLrncH3aL2q5rxkshX913QMc0zeRd16g-VJpljzI8amJbpPwnICrSCSchC9QKMQott6UaHXJGVnaUbttOWC6pRMnq2Q=w1022-h466-no?authuser=0';

// Environment Variables
const PORT = process.env.PORT || 5000;
const APEX_API_TOKEN = process.env.APEX_LEGENDS_API_TOKEN;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const GUILD_ID_PL = process.env.GUILD_ID_PL;

// Regex for triggering wholesome Gibby message reply
const pattern = /sad/i;

const app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

// Apex API GET Requests ------------------------------------------------------
let mapData;

// Setting the configuration for the request
const url = 'https://api.mozambiquehe.re/maprotation?version=2&auth=' + APEX_API_TOKEN;

function getCurrentMap() {

	request.get(url, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			mapData = JSON.parse(body);

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

			// Construct Message
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

			return { embedBattleRoyaleMessage, embedArenasMessage };
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

	const CURRENT_GUILD_ID = message.guild.id;

	// Check if content of message is "!ping"
	// if (message.content == '!ping') {
	// 	// Call .send() on the channel object the message was sent in
	// 	message.channel.send('pong!');
	// }

	if (message.content == '!map') {
		request.get(url, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				mapData = JSON.parse(body);

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

				// Construct Message
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


	// Return wholesome Gibby message (using regex, check all cases for text "sad")

	if (parseInt(CURRENT_GUILD_ID) == parseInt(GUILD_ID) || parseInt(CURRENT_GUILD_ID) == parseInt(GUILD_ID_PL)) {
		if (pattern.test(message.content)) {

			const gibbyJSON = require('./assets/gibby_quotes.json');
			const RNG = (Math.floor(Math.random() * 10)).toString();
			const wholesomeMessage = italic('"' + gibbyJSON.quotes[RNG].quote + '" - Makoa Gibraltar, 2733');
			const messageTTS = {
				'tts': true,
				'content': wholesomeMessage,
			};
			message.reply(messageTTS);
		}
	}
});

// Replying to slash commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	}
	else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	}
	else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
	else if (commandName === 'map') {
		let embedBattleRoyaleMessage;
		let embedArenasMessage;

		request.get(url, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				mapData = JSON.parse(body);

				// Battle Royale Data
				const brData = mapData.battle_royale;
				const brCurrentMap = brData.current.map;
				const brCurrentMapRemainingTimer = brData.current.remainingTimer;
				const brCurrentMapImage = brData.current.asset;
				const brNextMap = brData.next.map;

				// Arenas Data
				const arenaData = mapData.arenas;
				const arenasCurrentMap = arenaData.current.map;
				const arenasCurrentMapRemainingTimer = arenaData.current.remainingTimer;
				const areansCurrentMapImage = arenaData.current.asset;
				const arenasNextMap = arenaData.next.map;

				// Construct Message
				embedBattleRoyaleMessage = {
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

				embedArenasMessage = {
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

				interaction.reply({ embeds: [embedBattleRoyaleMessage, embedArenasMessage] });
			}
		});
	}
});

// Create a server and listen to it.
app.listen(PORT, () => {
	console.log(`Application is live and listening on port ${PORT}`);
});