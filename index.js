require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, REST, Routes, Events } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const BRAND_COLOR = 0x5865F2;  // Reusable color constant

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// === TICKET DROPDOWN HANDLER (BEFORE THE GUARD CLAUSE!) ===
client.on(Events.InteractionCreate, async (interaction) => {
  
  // FIX 1: Handle dropdown menus FIRST
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId !== 'ticket-type-select') return;
    
    const selectedType = interaction.values[0]; // 'support' or 'management'
    
    await interaction.reply({
      content: `✅ Opening a **${selectedType}** ticket...`,
      flags: 64  // Ephemeral (only sender sees it)
    });
    
    return;  // Stop processing after handling dropdown
  }
  
  // NOW check for slash commands (the original guard clause)
  if (!interaction.isChatInputCommand()) return;
  
  // === YOUR SLASH COMMANDS ===
  
  if (interaction.commandName === 'hello') {
    const HelloEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Hello There!')
      .setDescription('Helper Bot V1 is online and ready to help!')
      .setTimestamp();
    
    await interaction.reply({ embeds: [HelloEmbed] });
  }
  
  else if (interaction.commandName === 'ping') {
    const sent = await interaction.reply({ content: 'Pinging...', withResponse: true });
    const roundTripLatency = sent.resource.message.createdTimestamp - interaction.createdTimestamp;
    
    const pingEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Round-trip latency', value: `${roundTripLatency}ms`, inline: true },
        { name: 'WebSocket ping', value: `${Math.round(client.ws.ping)}ms`, inline: true }
      )
      .setTimestamp();
    
    await interaction.editReply({ content: null, embeds: [pingEmbed] });
  }
  
  else if (interaction.commandName === 'serverinfo') {
    if (!interaction.guild) { // <- Check is critical.
      return interaction.reply({ content: 'This command only works in a server.', flags: 64 });
    }
    
    const guild = interaction.guild;
    const serverEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ size: 256 }) || null)
      .addFields(
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [serverEmbed] });
  }
  
  else if (interaction.commandName === 'help') {
    const commands = await interaction.client.application.commands.fetch();
    
    const helpEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Helper Bot V1 - Commands')
      .setDescription('Here\'s a list of available commands:')
      .addFields(
        { name: '/hello', value: 'Get a friendly greeting from the bot', inline: false },
        { name: '/ping', value: 'Get the bot\'s latency', inline: false },
        { name: '/serverinfo', value: 'Show info about this server', inline: false },
        { name: '/help', value: 'Show this list of commands', inline: false }
        // Note: /ticket-panel is NOT here because it's deployed separately
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [helpEmbed] });
  }
  
  else if (interaction.commandName === 'ticket-panel') {
    const panelEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('🎫 Need Help?')
      .setDescription('Select the type of support you need from the dropdown menu below.');
    
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket-type-select')
      .setPlaceholder('Choose a ticket type')
      .addOptions(
        { label: 'Support', description: 'General Help and Questions', value: 'support' },
        { label: 'Management', description: 'Speak with management directly', value: 'management' }
      );
    
    const row = new ActionRowBuilder().addComponents(selectMenu);
    
    await interaction.reply({ embeds: [panelEmbed], components: [row] });
  }
});

// === MESSAGE CREATE (for legacy prefix commands if needed) ===
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return; 
  
  // Legacy hello command (still works if someone mentions @Bot hello)
  const mentionPattern = new RegExp(`<@!?${client.user.id}>`, 'g');
  const withoutMention = message.content.replace(mentionPattern, '').trim();
  
  if (withoutMention.toLowerCase() === 'hello') {
    const HelloEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Hello There!')
      .setDescription('Helper Bot V1 is online and ready to help!')
      .setTimestamp();
    
    await message.reply({ embeds: [HelloEmbed] });
  }
});

// === ERROR HANDLING ===
client.on(Events.Error, (error) => {
  console.error('[Client Error]', error);
});

process.on('unhandledRejection', (error) => {
  console.error('[Unhandled Promise]', error);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('[Unhandled Rejection]', error);
});

// Catch client errors
client.on('error', (error) => {
  console.error('[Client error]', error);
});

client.login(process.env.DISCORD_TOKEN);