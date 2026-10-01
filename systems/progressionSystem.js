const fs = require('fs');
const path = require('path');
const db = require('../database/connection');
const { ensureUserRecord } = require('../database/repositories/userRepository');
const { upsertPlayerProfile } = require('../database/repositories/profileRepository');
const { claimOwnership, getOwnershipByDiscordUser, getOwnershipByCharacterId } = require('../database/repositories/ownershipRepository');
const { validateCharacterDatabase, isValidCharacterId } = require('../utils/validation');
const { DuplicateCharacterClaimError, CharacterNotFoundError } = require('../utils/errors');

const CHARACTER_DATA_PATH = path.join(__dirname, '..', 'blue_lock_characters.json');

function loadCharacterDatabase() {
  if (!fs.existsSync(CHARACTER_DATA_PATH)) {
    throw new Error('Character database file is missing: blue_lock_characters.json');
  }

  const raw = fs.readFileSync(CHARACTER_DATA_PATH, 'utf8');
  if (!raw || !raw.trim()) {
    throw new Error('Character database file is empty. Add the authoritative Blue Lock character data JSON.');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Character database JSON is invalid: ${error.message}`);
  }

  validateCharacterDatabase(parsed);
  return parsed;
}

function getEligibleCharacters() {
  const database = loadCharacterDatabase();
  if (!Array.isArray(database)) return [];

  return database.filter(character => {
    if (!character) return false;
    if (character.mode1Eligible === false) return false;
    if (character.isPlayableInMode1 === false) return false;
    return true;
  });
}

function getCharacterById(characterId) {
  const characters = loadCharacterDatabase();
  if (!isValidCharacterId(characterId)) {
    throw new CharacterNotFoundError('Invalid character ID.');
  }

  return characters.find(character => String(character.id || character.character_id) === String(characterId)) || null;
}

function ensureCharacterRole(guild, character) {
  if (!guild) throw new Error('Guild context is required to manage roles.');

  const roleName = character.displayName || character.name || 'Blue Lock Character';
  let role = guild.roles.cache.find(existingRole => existingRole.name === roleName);

  if (!role) {
    role = guild.roles.create({
      name: roleName,
      mentionable: true,
      reason: `Create role for Blue Lock character: ${roleName}`
    });
  }

  return role;
}

async function claimCharacter({ guild, member, characterId }) {
  const character = getCharacterById(characterId);
  if (!character) {
    throw new CharacterNotFoundError(`Character ${characterId} does not exist.`);
  }

  const userRecord = ensureUserRecord(member.user);

  const existingOwnershipByUser = getOwnershipByDiscordUser(userRecord.discord_user_id);
  if (existingOwnershipByUser) {
    throw new Error('This user already owns a Mode 1 character.');
  }

  const existingByCharacter = getOwnershipByCharacterId(characterId);
  if (existingByCharacter) {
    throw new DuplicateCharacterClaimError(`Character ${characterId} is already claimed.`);
  }

  const role = await ensureCharacterRole(guild, character);
  await member.roles.add(role).catch(error => {
    throw new Error(`Unable to assign character role: ${error.message}`);
  });

  const ownership = db.transaction(() => {
    claimOwnership({
      discord_user_id: userRecord.discord_user_id,
      character_id: String(character.id || character.character_id),
      character_name: character.name || character.characterName || 'Unknown'
    });

    upsertPlayerProfile({
      discord_user_id: userRecord.discord_user_id,
      character_id: String(character.id || character.character_id),
      character_name: character.name || character.characterName || 'Unknown',
      position: character.position || character.role || 'Unknown',
      level: 1,
      xp: 0,
      ego: 0,
      current_stats: JSON.stringify(character.currentStats || character.stats || {}),
      wins: 0,
      losses: 0,
      matches: 0,
      abilities: JSON.stringify(character.abilities || []),
      energy_value: 100,
      condition_value: 100,
      progression_data: JSON.stringify(character.progression || {}),
      next_upgrade: JSON.stringify({
        nextLevel: 2,
        requirements: 'Use the progression system to add richer rules later.'
      }),
      overall: Number(character.Overall || character.overall || 0)
    });
  })();

  return {
    discordUserId: userRecord.discord_user_id,
    characterId: String(character.id || character.character_id),
    characterName: character.name || character.characterName || 'Unknown',
    position: character.position || character.role || 'Unknown',
    level: 1,
    xp: 0,
    ego: 0,
    overall: Number(character.Overall || character.overall || 0)
  };
}

module.exports = {
  CHARACTER_DATA_PATH,
  loadCharacterDatabase,
  getEligibleCharacters,
  getCharacterById,
  ensureCharacterRole,
  claimCharacter
};
