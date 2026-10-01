const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { LOCALIZATION } = require('../config/locales');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('عرض الأوامر المتاحة')
    .setDescriptionLocalizations({
      'en-US': 'Show available commands'
    }),
  async execute(interaction) {
    const locale = LOCALIZATION.ar;
    const embed = new EmbedBuilder()
      .setColor(0x3B82F6)
      .setTitle(locale.help.title)
      .setDescription(locale.help.description)
      .addFields(
        locale.help.commands.map(command => ({
          name: '•',
          value: command,
          inline: false
        }))
      );

    await interaction.reply({ embeds: [embed] });
  }
};
