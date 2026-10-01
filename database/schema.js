const db = require('./connection');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL UNIQUE,
      username TEXT,
      discriminator TEXT,
      display_name TEXT,
      guild_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS character_ownership (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL UNIQUE,
      character_id TEXT NOT NULL UNIQUE,
      character_name TEXT NOT NULL,
      claimed_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS player_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL UNIQUE,
      character_id TEXT NOT NULL,
      character_name TEXT NOT NULL,
      position TEXT,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      ego INTEGER DEFAULT 0,
      overall INTEGER DEFAULT 0,
      current_stats TEXT,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      matches INTEGER DEFAULT 0,
      abilities TEXT,
      energy_value INTEGER DEFAULT 100,
      condition_value INTEGER DEFAULT 100,
      progression_data TEXT,
      next_upgrade TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (discord_user_id) REFERENCES users(discord_user_id)
    );

    CREATE TABLE IF NOT EXISTS character_collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL,
      character_id TEXT NOT NULL,
      character_name TEXT,
      rarity TEXT,
      quantity INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(discord_user_id, character_id)
    );

    CREATE TABLE IF NOT EXISTS player_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL UNIQUE,
      strength INTEGER DEFAULT 0,
      speed INTEGER DEFAULT 0,
      technique INTEGER DEFAULT 0,
      teamwork INTEGER DEFAULT 0,
      stamina INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS player_progression (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL UNIQUE,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      talent_points INTEGER DEFAULT 0,
      progression_data TEXT,
      next_upgrade TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_type TEXT,
      status TEXT,
      mode TEXT,
      created_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS match_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      discord_user_id TEXT NOT NULL,
      team_number INTEGER,
      player_profile_id INTEGER,
      role TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenger_user_id TEXT NOT NULL,
      challenged_user_id TEXT NOT NULL,
      challenge_type TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL,
      mission_key TEXT NOT NULL,
      title TEXT,
      description TEXT,
      progress INTEGER DEFAULT 0,
      complete INTEGER DEFAULT 0,
      reward TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL,
      achievement_key TEXT NOT NULL,
      title TEXT,
      description TEXT,
      unlocked_at TEXT,
      UNIQUE(discord_user_id, achievement_key)
    );

    CREATE TABLE IF NOT EXISTS inventories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL,
      currency_key TEXT NOT NULL,
      amount INTEGER DEFAULT 0,
      UNIQUE(discord_user_id, currency_key)
    );

    CREATE TABLE IF NOT EXISTS cooldowns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_user_id TEXT NOT NULL,
      cooldown_type TEXT NOT NULL,
      expires_at TEXT,
      UNIQUE(discord_user_id, cooldown_type)
    );
  `);
}

module.exports = { initializeDatabase };
