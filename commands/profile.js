const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getEligibleCharacters, getCharacterById, claimCharacter } = require('../systems/characterSystem');
const { LOCALIZATION } = require('../config/locales');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose-character')
    .setDescription('اختيار شخصية اللاعب في وضع Mode 1')
    .addStringOption(option =>
      option.setName('character_id')
        .setDescription('معرف الشخصية (اختياري)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const locale = LOCALIZATION.ar;
    const characterId = interaction.options.getString('character_id');

    if (!characterId) {
      const eligibleCharacters = getEligibleCharacters();
      const fields = eligibleCharacters.map(character => ({
        name: `${character.id || character.character_id || 'unknown'} - ${character.name || character.characterName || 'غير معروف'}`,
        value: `المركز: ${character.position || 'غير محدد'}\nالرتبة: ${character.rarity || 'غير محدد'}\nالنوع: ${character.role || character.roles || 'غير محدد'}\n${character.mode1Eligible === false ? 'غير متاح' : 'متاح للاختيار'}`,
        inline: true
      }));

      const embed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('الشخصيات المتاحة لاختيارك')
        .setDescription('اختَر شخصية من القائمة التالية. إذا كنت تريد اختيار شخصية محددة، استخدم: /choose-character character_id:ID')
        .addFields(fields.length ? fields : [{ name: 'لا توجد شخصيات متاحة', value: 'يجب إضافة ملف blue_lock_characters.json صالح.', inline: false }]);

      return interaction.reply({ embeds: [embed] });
    }

    try {
      const result = await claimCharacter({
        guild: interaction.guild,
        member: interaction.member,
        characterId
      });

      const embed = new EmbedBuilder()
        .setColor(0x22C55E)
        .setTitle('تم اختيار الشخصية')
        .setDescription(`تم تعيين ${result.characterName} بنجاح إلى ${interaction.user.tag}.`)
        .addFields(
          { name: 'اسم الشخصية', value: result.characterName, inline: true },
          { name: 'المركز', value: result.position || 'غير محدد', inline: true },
          { name: 'المستوى', value: String(result.level || 1), inline: true }
        );

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Character claim failed:', error);
      const embed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('تعذر اختيار الشخصية')
        .setDescription(error.message || locale.errors.commandFailed);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
