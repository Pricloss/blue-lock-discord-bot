function isValidCharacterId(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateCharacterDatabase(data) {
  if (!Array.isArray(data)) {
    throw new Error('The character database root must be an array.');
  }

  for (const [index, character] of data.entries()) {
    if (!character || typeof character !== 'object') {
      throw new Error(`Character at index ${index} is invalid.`);
    }

    if (!character.id) {
      throw new Error(`Character at index ${index} is missing an id.`);
    }

    if (!character.name) {
      throw new Error(`Character ${character.id} is missing a name.`);
    }

    if (character.mode_1 === undefined && character.mode1Eligible === undefined) {
      throw new Error(`Character ${character.id} is missing mode eligibility flags.`);
    }
  }

  return true;
}

module.exports = {
  isValidCharacterId,
  validateCharacterDatabase
};
