const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const request = require('request');
const { Client, Intents } = require('discord.js');
const GIBBY_LAUGH = 'https://lh3.googleusercontent.com/pw/AM-JKLVGx1ZWfcDVTgCVCEAZ2ks1e-grT6oO2rEZ4LWWK5B6ZTLwV0wl3iCg9Nx068KfLrncH3aL2q5rxkshX913QMc0zeRd16g-VJpljzI8amJbpPwnICrSCSchC9QKMQott6UaHXJGVnaUbttOWC6pRMnq2Q=w1022-h466-no?authuser=0';
const helpers = require('./utils/helpers.util.js');
const config = require('./configs/general.config.js');

const app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

// Apex API GET Requests ------------------------------------------------------

// Setting the configuration for the request
const url = config.APEX_API_URL + config.APEX_API_TOKEN;

async function sendChannelMessage(hook, message, isSlashCommand) {

	if (isSlashCommand) {
		hook.reply(message);
	}
	else {
		hook.channel.send(message);
	}
}

async function getCurrentMap(hook, isSlashCommand) {

	request.get(url, async function (error, response, body) {
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

app.get('', async (req, res) => {
	res.send('I\'m up!');
});

// Discord Client -------------------------------------------------------------

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Login to Discord with your client's token
client.login(config.DISCORD_TOKEN);

// client is an instance of Discord.Client
client.on('messageCreate', async (message) => {

	const CURRENT_GUILD_ID = message.guild.id;

	// If content of message has keyword {sad}, return the Gibby TTS message
	if (parseInt(CURRENT_GUILD_ID) == parseInt(config.GUILD_ID) || parseInt(CURRENT_GUILD_ID) == parseInt(config.GUILD_ID_PL)) {

		// Regex for triggering wholesome Gibby message reply
		const pattern = /sad/i;

		// Return wholesome Gibby message (using regex, check all cases for text "sad")
		if (pattern.test(message.content)) {
			const messageTTS = helpers.createWholesomeGibbyMessage();
			message.reply(messageTTS);
		}
	}

	// If content of message is "!map", return the map rotation
	if (message.content == '!map') {
		await getCurrentMap(message, false);
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
		await getCurrentMap(interaction, true);
	}
});

// Create a server and listen to it.
app.listen(config.PORT, () => {
	console.log(`Application is live and listening on port ${config.PORT}`);
});