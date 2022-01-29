var express = require('express'); // Express web server framework
var cors = require('cors');
var cookieParser = require('cookie-parser');
var request = require('request'); // "Request" library
require('dotenv').config();
const { Client, Intents, MessageEmbed, MessageFlags } = require('discord.js');

// Environment Variables
const PORT = process.env.PORT || 5000;
const APEX_API_TOKEN = process.env.APEX_LEGENDS_API_TOKEN;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// APEX API URL
const APEX_API_HOST = 'https://api.mozambiquehe.re';
const APEX_API_PATH = '/maprotation?version=2'
const GIBBY_IMG = 'https://images.gnwcdn.com/2020/usgamer/apex-legends-gibby-bug.jpg';

// Regex
const pattern = /sad/i;

var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

// Apex API GET Requests ------------------------------------------------------
var mapData = '';
var mapMessage = 'not started';


// Setting the configuration for the request
const url = 'https://api.mozambiquehe.re/maprotation?version=2&auth=' + APEX_API_TOKEN;

function getCurrentMap() {

    request.get(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            mapData = JSON.parse(body);

            // Battle Royale Data
            var brData = mapData.battle_royale;
            var brCurrentMap = brData.current.map;
            var brCurrentMapRemainingMinutes = brData.current.remainingMins;
            var brCurrentMapRemainingTimer = brData.current.remainingTimer;
            var brCurrentMapImage = brData.current.asset;
            var brNextMap = brData.next.map;

            // Arenas Data
            var arenaData = mapData.arenas;
            var arenasCurrentMap = arenaData.current.map;
            var arenasCurrentMapRemainingMinutes = arenaData.current.remainingMins;
            var arenasCurrentMapRemainingTimer = arenaData.current.remainingTimer;
            var areansCurrentMapImage = arenaData.current.asset;
            var arenasNextMap = arenaData.next.map;

            // Construct Message
            var battleRoyaleMessage = "**Battle Royale:**\nThe current map is **" + brCurrentMap + "** for the next **" + brCurrentMapRemainingMinutes + "** minutes.\nThe next map is **" + brNextMap + "** bruddas."
            var arenasMessage = "\n\n**Arenas:**\nThe current map is **" + arenasCurrentMap + "** for the next **" + arenasCurrentMapRemainingMinutes + "** minutes.\nThe next map is **" + arenasNextMap + "**."
            mapMessage = battleRoyaleMessage + arenasMessage;

            var embedBattleRoyaleMessage = {
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
                    url: brCurrentMapImage
                },
                footer: {
                    text: 'Next map: ' + brNextMap,
                }
            }

            var embedArenasMessage = {
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
                    url: areansCurrentMapImage
                },
                footer: {
                    text: 'Next map: ' + arenasNextMap,
                }
            }

            embedDemo = new MessageEmbed()
                .setColor('0x0099ff')
                .setTitle('Battle Royale');

            return;
        }
    });
}

app.get('', async (req, res) => {
    res.send("I'm up!");
})

app.get('/apex', async (_, res) => {
    getCurrentMap();
    res.send(mapData);
    res.end();
})


// // Discord Client -------------------------------------------------------------
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.login(DISCORD_TOKEN);

// client is an instance of Discord.Client
client.on("messageCreate", async (message) => {

    getCurrentMap();

    if (message.content == "!ping") { // Check if content of message is "!ping"
        message.channel.send("pong!"); // Call .send() on the channel object the message was sent in
    }

    if (message.content == "!test") {
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                getCurrentMap();

                // TODO: add a promise here to wait until getCurrentMap is updated before message is sent
                message.channel.send(mapMessage);
            }
        })
    }

    if (message.content == "!map") {
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                mapData = JSON.parse(body);

                // Battle Royale Data
                var brData = mapData.battle_royale;
                var brCurrentMap = brData.current.map;
                var brCurrentMapRemainingMinutes = brData.current.remainingMins;
                var brCurrentMapRemainingTimer = brData.current.remainingTimer;
                var brCurrentMapImage = brData.current.asset;
                var brNextMap = brData.next.map;

                // Arenas Data
                var arenaData = mapData.arenas;
                var arenasCurrentMap = arenaData.current.map;
                var arenasCurrentMapRemainingMinutes = arenaData.current.remainingMins;
                var arenasCurrentMapRemainingTimer = arenaData.current.remainingTimer;
                var areansCurrentMapImage = arenaData.current.asset;
                var arenasNextMap = arenaData.next.map;

                // Construct Message
                var battleRoyaleMessage = "**Battle Royale:**\nThe current map is **" + brCurrentMap + "** for the next **" + brCurrentMapRemainingMinutes + "** minutes.\nThe next map is **" + brNextMap + "** bruddas."
                var arenasMessage = "\n\n**Arenas:**\nThe current map is **" + arenasCurrentMap + "** for the next **" + arenasCurrentMapRemainingMinutes + "** minutes.\nThe next map is **" + arenasNextMap + "**."
                mapMessage = battleRoyaleMessage + arenasMessage;

                var embedBattleRoyaleMessage = {
                    color: 0x0099ff,
                    title: 'Battle Royale',
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
                        url: brCurrentMapImage
                    },
                    footer: {
                        text: 'Next map: ' + brNextMap,
                    }
                }

                var embedArenasMessage = {
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
                        url: areansCurrentMapImage
                    },
                    footer: {
                        text: 'Next map: ' + arenasNextMap,
                    }
                }

                embedDemo = new MessageEmbed()
                    .setColor('0x0099ff')
                    .setTitle('Battle Royale');

                message.channel.send({ embeds: [embedBattleRoyaleMessage, embedArenasMessage] });
            }
        });

    }

    // Using regex, check all cases for text "sad" 
    //if (pattern.test(message.content)) 
    if (message.content == "!sad") {
        var gibbyJSON = require("./gibby_quotes.json");
        var RNG = (Math.floor(Math.random() * 10)).toString();
        var wholesomeMessage = gibbyJSON.quotes[RNG].quote;
        message.channel.send(wholesomeMessage);
    }
});

// Create a server and listen to it.
app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
});