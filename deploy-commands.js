require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Get a friendly greeting from the bot'),

    new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the bot\'s latency'),

    new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about this server'),

    new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of available commands'),

    new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Post the support ticket panel')
    .setDefaultMemberPermissions(0x8), // Admin-only.
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();