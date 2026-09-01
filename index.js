require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const PREFIX = '!';

client.on('messageCreate', (message) => {
    console.log(`Recieved message: "${message.content}"`);
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;

    const withoutMention = message.content.replace(`<@${client.user.id}>`, '').trim();
    const args = withoutMention.split(/ + /);
    const command = args.shift().toLowerCase();

    if (command === 'hello') {
        message.reply('Hello World');
    }

    else if (command === 'ping') {
        message.reply('Pong!');
    }
});

client.login(process.env.DISCORD_TOKEN);