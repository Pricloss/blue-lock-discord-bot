class CharacterNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CharacterNotFoundError';
  }
}

class DuplicateCharacterClaimError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateCharacterClaimError';
  }
}

module.exports = {
  CharacterNotFoundError,
  DuplicateCharacterClaimError
};
