const fs = require('fs');
const path = require('path');
const db = require('../database/connection');
const { ensureUserRecord } = require('../database/repositories/userRepository');
const { upsertPlayerProfile } = require('../database/repositories/profileRepository');
const { claimOwnership, getOwnershipByCharacterId, getOwnershipByDiscordUser } = require('../database/repositories/ownershipRepository');
const { validateCharacterDatabase, isValidCharacterId } = require('../utils/validation');
const { CharacterNotFoundError, DuplicateCharacterClaimError } = require('../utils/errors');

const CHARACTER_DATA_PATH = path.join(__dirname, '..', 'blue_lock_characters.json');

let characterCache = null;

function loadCharacterDatabase() {
  if (!fs.existsSync(CHARACTER_DATA_PATH)) {
    throw new Error('Missing character database file: blue_lock_characters.json');
  }

  const raw = fs.readFileSync(CHARACTER_DATA_PATH, 'utf8');
  if (!raw || !raw.trim()) {
    throw new Error('Character database file is empty.');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Character database is invalid JSON: ${error.message}`);
  }

  validateCharacterDatabase(parsed);
  characterCache = parsed;
  return parsed;
}

function getCharacterById(characterId) {
  if (!isValidCharacterId(characterId)) {
    throw new CharacterNotFoundError('Invalid character ID.');
  }

  if (!characterCache) {
    characterCache = loadCharacterDatabase();
  }

  return characterCache.find(character => String(character.id) === String(characterId)) || null;
}

function getEligibleCharacters() {
  if (!characterCache) {
    characterCache = loadCharacterDatabase();
  }

  return characterCache.filter(character => character.mode_1 === true);
}

async function ensureCharacterRole(guild, character) {
  const roleName = character.displayName || character.name || 'Blue Lock Character';
  let role = guild.roles.cache.find(existingRole => existingRole.name === roleName);

  if (!role) {
    try {
      role = await guild.roles.create({
        name: roleName,
        mentionable: true,
        reason: `Add role for ${roleName}`
      });
    } catch (error) {
      throw new Error(`Failed to create Discord role: ${error.message}`);
    }
  }

  return role;
}

async function claimCharacter({ guild, member, characterId }) {
  const character = getCharacterById(characterId);
  if (!character) {
    throw new CharacterNotFoundError(`Character ${characterId} does not exist.`);
  }

  const userRecord = ensureUserRecord(member.user);

  if (getOwnershipByDiscordUser(userRecord.discord_user_id)) {
    throw new Error('This user already owns a Mode 1 character.');
  }

  if (getOwnershipByCharacterId(characterId)) {
    throw new DuplicateCharacterClaimError(`Character ${characterId} is already claimed.`);
  }

  const role = await ensureCharacterRole(guild, character);
  await member.roles.add(role).catch(error => {
    throw new Error(`Unable to assign Discord role: ${error.message}`);
  });

  db.transaction(() => {
    claimOwnership({
      discord_user_id: userRecord.discord_user_id,
      character_id: String(character.id),
      character_name: character.name
    });

    upsertPlayerProfile({
      discord_user_id: userRecord.discord_user_id,
      character_id: String(character.id),
      character_name: character.name,
      position: character.primary_position || character.position || 'Unknown',
      level: 1,
      xp: 0,
      ego: 0,
      overall: Number(character.stats?.overall || 0),
      current_stats: JSON.stringify(character.stats || {}),
      wins: 0,
      losses: 0,
      matches: 0,
      abilities: JSON.stringify(character.abilities || []),
      energy_value: 100,
      condition_value: 100,
      progression_data: JSON.stringify(character.growth || {}),
      next_upgrade: JSON.stringify({
        nextLevel: 2,
        note: 'Placeholder progression extension point. Future rules to be defined.'
      })
    });
  })();

  return {
    discordUserId: userRecord.discord_user_id,
    characterId: String(character.id),
    characterName: character.name,
    position: character.primary_position || 'Unknown',
    level: 1,
    xp: 0,
    ego: 0,
    overall: Number(character.stats?.overall || 0)
  };
}

module.exports = {
  CHARACTER_DATA_PATH,
  loadCharacterDatabase,
  getCharacterById,
  getEligibleCharacters,
  ensureCharacterRole,
  claimCharacter
};
