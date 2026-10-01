const db = require('../database/connection');

function getCollectionByUser(discordUserId) {
  return db.prepare('SELECT * FROM character_collections WHERE discord_user_id = ? ORDER BY character_name').all(String(discordUserId));
}

module.exports = {
  getCollectionByUser
};
