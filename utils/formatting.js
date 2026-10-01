function formatCharacterList(characters) {
  return characters.map(character => ({
    name: `${character.id} - ${character.name}`,
    value: `المركز: ${character.primary_position || 'غير محدد'}\nالرتبة: ${character.rarity || 'غير محدد'}\nOverall: ${character.stats?.overall || 0}`,
    inline: true
  }));
}

function safeJsonParse(value, fallback = {}) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

module.exports = {
  formatCharacterList,
  safeJsonParse
};
