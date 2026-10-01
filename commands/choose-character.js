const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getEligibleCharacters, claimCharacter } = require('../systems/characterSystem');

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
    const characterId = interaction.options.getString('character_id');

    if (!characterId) {
      const characters = getEligibleCharacters();
      const fields = characters.map(character => ({
        name: `${character.id} - ${character.name}`,
        value: `المركز: ${character.primary_position || 'غير محدد'}\nالرتبة: ${character.rarity || 'غير محدد'}\nالحالة: متاح للاختيار`,
        inline: true
      }));

      const embed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('الشخصيات المتاحة لاختيارك')
        .setDescription('استخدم /choose-character character_id:<id> لاختيار شخصية محددة.')
        .addFields(fields.length ? fields : [{ name: 'لا توجد شخصيات متاحة', value: 'يجب إعداد ملف الشخصية الصحيح.', inline: false }]);

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
          { name: 'المركز', value: result.position, inline: true },
          { name: 'المستوى', value: String(result.level), inline: true }
        );

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('تعذر اختيار الشخصية')
        .setDescription(error.message || 'حدث خطأ غير متوقع.');

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
