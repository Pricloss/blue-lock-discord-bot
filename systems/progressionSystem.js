function getDefaultProgressionData(character) {
  return {
    level: 1,
    xp: 0,
    nextUpgrade: {
      level: 2,
      requirement: 'Extension point for future progression rules.'
    },
    growth: character.growth || {},
    overall: character.stats?.overall || 0,
    notes: 'The Overall formula comes from the character JSON source data and is not replaced by this bot.'
  };
}

module.exports = { getDefaultProgressionData };
