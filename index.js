require('dotenv').config();

const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder } = require('discord.js');
const path = require('path');
const { initializeDatabase } = require('./database/schema');
const { loadCharacterDatabase } = require('./systems/characterSystem');
const { LOCALIZATION } = require('./config/locales');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandModules = [
  './commands/help',
  './commands/choose-character',
  './commands/profile',
  './commands/debug-db'
];

for (const modulePath of commandModules) {
  const command = require(path.join(__dirname, modulePath));
  client.commands.set(command.data.name, command);
}

async function registerSlashCommands() {
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

  const payload = client.commands.map(command => command.data.toJSON());

  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: payload });
      console.log('Guild slash commands registered.');
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: payload });
      console.log('Global slash commands registered.');
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
    console.log('Database and character source validated successfully.');
  } catch (error) {
    console.error('Startup validation failed:', error.message);
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

    const response = {
      content: LOCALIZATION.ar.errors.commandFailed,
      embeds: [
        new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('خطأ في الأوامر')
          .setDescription(error.message || 'حدث خطأ غير متوقع.')
      ]
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(response).catch(() => null);
    } else {
      await interaction.reply(response).catch(() => null);
    }
  }
});

async function bootstrap() {
  try {
    initializeDatabase();
    loadCharacterDatabase();
    await registerSlashCommands();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Bot bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap();
