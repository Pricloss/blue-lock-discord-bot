const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'blue_lock_bot.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

module.exports = db;
