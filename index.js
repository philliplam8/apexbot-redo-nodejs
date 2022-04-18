const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Client, Intents } = require('discord.js');
const helpers = require('./utils/helpers.util.js');
require('dotenv').config();
const config = require('./configs/general.config.js');
const mapRotation = require('./services/map-rotation.service');

const app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

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
		await mapRotation.getCurrentMap(message, false);
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
		await mapRotation.getCurrentMap(interaction, true);
	}
});

// Create a server and listen to it.
app.listen(config.PORT, () => {
	console.log(`Application is live and listening on port ${config.PORT}`);
});