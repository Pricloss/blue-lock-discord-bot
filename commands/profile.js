const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPlayerProfileByDiscordId } = require('../database/repositories/profileRepository');
const { getCharacterById } = require('../systems/characterSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('عرض الملف الشخصي للاعب')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('العضو المراد عرض ملفه الشخصي')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetMember = interaction.options.getMember('member') || interaction.member;
    const profile = getPlayerProfileByDiscordId(targetMember.id);

    if (!profile) {
      const embed = new EmbedBuilder()
        .setColor(0xF59E0B)
        .setTitle('لا يوجد ملف شخصي')
        .setDescription(`${targetMember.user.tag} لم يختَر بعد شخصية Mode 1.`);
      return interaction.reply({ embeds: [embed] });
    }

    const character = getCharacterById(profile.character_id);
    const stats = profile.current_stats ? JSON.parse(profile.current_stats) : {};
    const progression = profile.progression_data ? JSON.parse(profile.progression_data) : {};
    const abilities = profile.abilities ? JSON.parse(profile.abilities) : [];

    const abilityText = Array.isArray(abilities)
      ? abilities.map(a => a.name || String(a)).join(', ')
      : 'لا توجد';

    const embed = new EmbedBuilder()
      .setColor(0x8B5CF6)
      .setTitle(`ملف ${targetMember.user.tag}`)
      .setDescription(`الشخصية المختارة: ${profile.character_name}`)
      .addFields(
        { name: 'اسم الشخصية', value: profile.character_name || 'غير محدد', inline: true },
        { name: 'المركز', value: profile.position || character?.primary_position || 'غير محدد', inline: true },
        { name: 'المستوى', value: String(profile.level || 1), inline: true },
        { name: 'XP', value: String(profile.xp || 0), inline: true },
        { name: 'Ego', value: String(profile.ego || 0), inline: true },
        { name: 'Overall', value: String(profile.overall || stats.overall || 0), inline: true },
        { name: 'إحصاءات حيوية', value: JSON.stringify(stats).slice(0, 200) || 'لا توجد', inline: false },
        { name: 'الطاقة', value: `${profile.energy_value || 100} / 100`, inline: true },
        { name: 'الحالة', value: `${profile.condition_value || 100} / 100`, inline: true },
        { name: 'المهارات', value: abilityText, inline: false },
        { name: 'التقدم', value: JSON.stringify(progression).slice(0, 200) || 'لا توجد بيانات', inline: false }
      );

    return interaction.reply({ embeds: [embed] });
  }
};
