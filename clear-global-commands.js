require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started clearing global commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] }
        );

        console.log('Successfully cleared global commands.');
    }   catch (error) {
        console.error('[Clear Commands Error]', error);
    }
})();