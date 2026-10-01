const db = require('../database/connection');

function addCharacterToCollection(discordUserId, characterId, characterName, rarity) {
  const existing = db.prepare('SELECT * FROM character_collections WHERE discord_user_id = ? AND character_id = ?').get(String(discordUserId), String(characterId));

  if (existing) {
    db.prepare('UPDATE character_collections SET quantity = quantity + 1, updated_at = CURRENT_TIMESTAMP WHERE discord_user_id = ? AND character_id = ?').run(String(discordUserId), String(characterId));
    return db.prepare('SELECT * FROM character_collections WHERE discord_user_id = ? AND character_id = ?').get(String(discordUserId), String(characterId));
  }

  db.prepare('INSERT INTO character_collections (discord_user_id, character_id, character_name, rarity, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').run(
    String(discordUserId),
    String(characterId),
    characterName,
    rarity || 'Unknown'
  );

  return db.prepare('SELECT * FROM character_collections WHERE discord_user_id = ? AND character_id = ?').get(String(discordUserId), String(characterId));
}

module.exports = { addCharacterToCollection };
