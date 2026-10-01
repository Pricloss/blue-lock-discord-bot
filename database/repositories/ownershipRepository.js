const db = require('../connection');

function claimOwnership({ discord_user_id, character_id, character_name }) {
  try {
    db.prepare('INSERT INTO character_ownership (discord_user_id, character_id, character_name, claimed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)').run(
      String(discord_user_id),
      String(character_id),
      character_name
    );
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      throw new Error('This character has already been claimed.');
    }
    throw error;
  }
}

function getOwnershipByDiscordUser(discordUserId) {
  return db.prepare('SELECT * FROM character_ownership WHERE discord_user_id = ?').get(String(discordUserId));
}

function getOwnershipByCharacterId(characterId) {
  return db.prepare('SELECT * FROM character_ownership WHERE character_id = ?').get(String(characterId));
}

module.exports = {
  claimOwnership,
  getOwnershipByDiscordUser,
  getOwnershipByCharacterId
};
