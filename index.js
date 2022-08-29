const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const config = require('./configs/general.config.js');
const bot = require('./services/discord-bot-service.js');

const app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

app.get('', async (req, res) => {
	res.send('Visit route /start to start bot!');
});

app.get('/start', async (req, res) => {
	bot.startDiscordBot();
	res.send('I\'m up!');

});

// Create a server and listen to it.
app.listen(config.PORT, () => {
	console.log(`Application is live and listening on port ${config.PORT}`);
});