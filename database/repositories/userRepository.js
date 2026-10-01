const db = require('../database/connection');

function ensureUserRecord(discordUser) {
  if (!discordUser || !discordUser.id) {
    throw new Error('Discord user data is missing.');
  }

  const existing = db.prepare('SELECT * FROM users WHERE discord_user_id = ?').get(String(discordUser.id));
  if (existing) {
    db.prepare('UPDATE users SET username = ?, discriminator = ?, display_name = ?, updated_at = CURRENT_TIMESTAMP WHERE discord_user_id = ?').run(
      discordUser.username || existing.username,
      discordUser.discriminator || existing.discriminator,
      discordUser.globalName || discordUser.username || existing.display_name,
      String(discordUser.id)
    );
    return db.prepare('SELECT * FROM users WHERE discord_user_id = ?').get(String(discordUser.id));
  }

  const result = db.prepare('INSERT INTO users (discord_user_id, username, discriminator, display_name, guild_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').run(
    String(discordUser.id),
    discordUser.username || 'unknown',
    discordUser.discriminator || '0000',
    discordUser.globalName || discordUser.username || 'unknown',
    discordUser.guildId || null
  );

  return db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
}

function getUserByDiscordId(discordUserId) {
  return db.prepare('SELECT * FROM users WHERE discord_user_id = ?').get(String(discordUserId));
}

module.exports = {
  ensureUserRecord,
  getUserByDiscordId
};
