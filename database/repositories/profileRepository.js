const db = require('../database/connection');

function upsertPlayerProfile(profileData) {
  const existing = db.prepare('SELECT * FROM player_profiles WHERE discord_user_id = ?').get(String(profileData.discord_user_id));

  if (existing) {
    db.prepare(`
      UPDATE player_profiles SET
        character_id = ?,
        character_name = ?,
        position = ?,
        level = ?,
        xp = ?,
        ego = ?,
        overall = ?,
        current_stats = ?,
        wins = ?,
        losses = ?,
        matches = ?,
        abilities = ?,
        energy_value = ?,
        condition_value = ?,
        progression_data = ?,
        next_upgrade = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE discord_user_id = ?
    `).run(
      profileData.character_id,
      profileData.character_name,
      profileData.position,
      profileData.level,
      profileData.xp,
      profileData.ego,
      profileData.overall,
      profileData.current_stats,
      profileData.wins,
      profileData.losses,
      profileData.matches,
      profileData.abilities,
      profileData.energy_value,
      profileData.condition_value,
      profileData.progression_data,
      profileData.next_upgrade,
      String(profileData.discord_user_id)
    );
    return db.prepare('SELECT * FROM player_profiles WHERE discord_user_id = ?').get(String(profileData.discord_user_id));
  }

  db.prepare(`
    INSERT INTO player_profiles (
      discord_user_id,
      character_id,
      character_name,
      position,
      level,
      xp,
      ego,
      overall,
      current_stats,
      wins,
      losses,
      matches,
      abilities,
      energy_value,
      condition_value,
      progression_data,
      next_upgrade,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(
    String(profileData.discord_user_id),
    profileData.character_id,
    profileData.character_name,
    profileData.position,
    profileData.level,
    profileData.xp,
    profileData.ego,
    profileData.overall,
    profileData.current_stats,
    profileData.wins,
    profileData.losses,
    profileData.matches,
    profileData.abilities,
    profileData.energy_value,
    profileData.condition_value,
    profileData.progression_data,
    profileData.next_upgrade
  );

  return db.prepare('SELECT * FROM player_profiles WHERE discord_user_id = ?').get(String(profileData.discord_user_id));
}

function getPlayerProfileByDiscordId(discordUserId) {
  return db.prepare('SELECT * FROM player_profiles WHERE discord_user_id = ?').get(String(discordUserId));
}

module.exports = {
  upsertPlayerProfile,
  getPlayerProfileByDiscordId
};
