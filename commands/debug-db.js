const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/connection');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('debug-db')
    .setDescription('إظهار معلومات قاعدة البيانات (مشرف فقط)')
    .addBooleanOption(option =>
      option.setName('verbose')
        .setDescription('إظهار تفاصيل إضافية')
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: 'هذا الأمر للمديرين فقط.', ephemeral: true });
    }

    const verbose = interaction.options.getBoolean('verbose') || false;
    const counts = {
      users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      character_ownership: db.prepare('SELECT COUNT(*) as count FROM character_ownership').get().count,
      player_profiles: db.prepare('SELECT COUNT(*) as count FROM player_profiles').get().count,
      character_collections: db.prepare('SELECT COUNT(*) as count FROM character_collections').get().count,
      matches: db.prepare('SELECT COUNT(*) as count FROM matches').get().count,
      challenges: db.prepare('SELECT COUNT(*) as count FROM challenges').get().count,
      missions: db.prepare('SELECT COUNT(*) as count FROM missions').get().count,
      achievements: db.prepare('SELECT COUNT(*) as count FROM achievements').get().count,
      cooldowns: db.prepare('SELECT COUNT(*) as count FROM cooldowns').get().count
    };

    const embed = new EmbedBuilder()
      .setColor(0x6366F1)
      .setTitle('حالة قاعدة البيانات')
      .setDescription('معلومات سريعة عن الجداول الأساسية.')
      .addFields(
        Object.entries(counts).map(([key, value]) => ({ name: key, value: String(value), inline: true }))
      );

    if (verbose) {
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all();
      embed.addFields({
        name: 'Tables',
        value: tables.map(row => row.name).join(', ') || 'No tables',
        inline: false
      });
    }

    return interaction.reply({ embeds: [embed] });
  }
};
