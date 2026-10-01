function isValidCharacterId(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateCharacterDatabase(data) {
  if (!Array.isArray(data)) {
    throw new Error('The character database root must be an array of character objects.');
  }

  for (const [index, character] of data.entries()) {
    if (!character || typeof character !== 'object') {
      throw new Error(`Character at index ${index} is invalid.`);
    }

    const identifier = character.id || character.character_id;
    const name = character.name || character.characterName;

    if (!identifier) {
      throw new Error(`Character at index ${index} is missing an id field.`);
    }

    if (!name) {
      throw new Error(`Character ${identifier} is missing a name field.`);
    }
  }

  return true;
}

module.exports = {
  isValidCharacterId,
  validateCharacterDatabase
};
