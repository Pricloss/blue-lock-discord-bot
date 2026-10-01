function getDefaultProgressionData(character) {
  return {
    level: 1,
    xp: 0,
    nextUpgrade: {
      level: 2,
      requirement: 'This is a placeholder progression extension point for future systems.'
    },
    growth: character.growth || 0,
    overall: character.Overall || character.overall || 0,
    notes: 'The Overall formula comes from the character JSON source data. Do not invent a new formula.'
  };
}

module.exports = {
  getDefaultProgressionData
};
