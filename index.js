// var request = require('request'); // "Request" library
var express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Discord
const Discord = require("discord.js"); // Requires the npm package 'discord.js'.
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

client.login(DISCORD_TOKEN);

// client is an instance of Discord.Client
client.on("message", (message) => {
    if (message.content == "!ping") { // Check if content of message is "!ping"
        message.channel.send("pong!"); // Call .send() on the channel object the message was sent in
    }
});

// Express 
var app = express();

app.get('/', async (_, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Connected successfully!',
    });
})

// Create a server and listen to it.
app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
});