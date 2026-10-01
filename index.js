require('dotenv').config();

const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, PermissionsBitField } = require('discord.js');
const path = require('path');
const db = require('./database/connection');
const { initializeDatabase } = require('./database/schema');
const { loadCharacterDatabase, getEligibleCharacters, claimCharacter, getCharacterById } = require('./systems/characterSystem');
const { getUserByDiscordId, ensureUserRecord } = require('./database/repositories/userRepository');
const { getPlayerProfileByDiscordId } = require('./database/repositories/profileRepository');
const { formatCharacterList, formatProfileEmbed } = require('./utils/formatting');
const { LOCALIZATION } = require('./config/locales');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandFiles = [
  './commands/help',
  './commands/choose-character',
  './commands/profile',
  './commands/debug-db'
];

for (const file of commandFiles) {
  const command = require(path.join(__dirname, file));
  client.commands.set(command.data.name, command);
}

async function registerCommands() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId) {
    console.warn('Missing DISCORD_TOKEN or DISCORD_CLIENT_ID. Slash commands will not be registered.');
    return;
  }

  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const rest = new REST({ version: '10' }).setToken(token);

  const commandPayload = client.commands.map(command => command.data.toJSON());

  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandPayload
      });
      console.log('Guild commands registered successfully.');
    } else {
      await rest.put(Routes.applicationCommands(clientId), {
        body: commandPayload
      });
      console.log('Global commands registered successfully.');
    }
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`Bot ready: ${client.user.tag}`);

  try {
    initializeDatabase();
    loadCharacterDatabase();
    console.log('Character database loaded and validated.');
  } catch (error) {
    console.error('Startup validation failed:', error.message);
    console.error('Add the real blue_lock_characters.json file with valid data before starting the bot.');
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Command execution failed:', error);

    const failureMessage = LOCALIZATION.ar.errors.commandFailed;
    const reply = {
      content: failureMessage,
      embeds: [
        new EmbedBuilder()
          .setColor(0xFF4D4D)
          .setTitle('خطأ في الأوامر')
          .setDescription(error.message || 'حدث خطأ غير متوقع.')
      ]
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(reply).catch(() => null);
    } else {
      await interaction.reply(reply).catch(() => null);
    }
  }
});

async function bootstrap() {
  try {
    initializeDatabase();
    loadCharacterDatabase();
    await registerCommands();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Failed to bootstrap bot:', error);
    process.exit(1);
  }
}

bootstrap();
