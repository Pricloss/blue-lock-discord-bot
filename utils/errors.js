function formatCharacterList(characters) {
  return characters.map(character => ({
    name: `${character.id || character.character_id} - ${character.name || character.characterName || 'Unknown'}`,
    value: `Rarity: ${character.rarity || 'Unknown'}\nPosition: ${character.position || 'Unknown'}\nOverall: ${character.Overall || character.overall || 0}`,
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
