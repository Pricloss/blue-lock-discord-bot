const db = require('../database/connection');
const { ensureUserRecord } = require('../database/repositories/userRepository');

function addCharacterToCollection(discordUserId, characterId, characterName, rarity) {
  const user = ensureUserRecord({ id: discordUserId, username: 'unknown', tag: 'unknown' });

  const existing = db.prepare('SELECT * FROM character_collections WHERE discord_user_id = ? AND character_id = ?').get(user.discord_user_id, String(characterId));
  if (existing) {
    db.prepare('UPDATE character_collections SET quantity = quantity + 1, updated_at = CURRENT_TIMESTAMP WHERE discord_user_id = ? AND character_id = ?').run(user.discord_user_id, String(characterId));
    return existing;
  }

  db.prepare('INSERT INTO character_collections (discord_user_id, character_id, character_name, rarity, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').run(
    user.discord_user_id,
    String(characterId),
    characterName,
    rarity || 'Unknown'
  );

  return { discord_user_id: user.discord_user_id, character_id: String(characterId), quantity: 1 };
}

module.exports = {
  addCharacterToCollection
};
