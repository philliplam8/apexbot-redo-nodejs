require('dotenv').config();

const general = {
	APEX_API_URL: 'https://api.mozambiquehe.re/maprotation?version=2&auth=',
	APEX_API_TOKEN: process.env.APEX_LEGENDS_API_TOKEN,
	DISCORD_TOKEN: process.env.DISCORD_TOKEN,
	GUILD_ID: process.env.GUILD_ID,
	GUILD_ID_PL: process.env.GUILD_ID_PL,
	PORT: process.env.PORT || 5000,
};

module.exports = general;