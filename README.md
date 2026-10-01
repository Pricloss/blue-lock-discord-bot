# Blue Lock Discord Bot

This repository contains the first stable foundation for a Blue Lock-themed Discord bot.

## Scope

- Mode 1: one personal Blue Lock character per Discord member
- Mode 2: collection-based virtual character gathering
- SQLite-backed persistent database
- Modular architecture with separate command and system layers
- Role management and safe ownership enforcement
- Startup validation for the character JSON database

## Important rules followed

- The authoritative character database lives in `blue_lock_characters.json`.
- Numeric stats, Overall, growth, rarity, effects, levels, roles, and potential are treated as original game-design values, not official Blue Lock ratings.
- Rarity is not treated as absolute canon power ranking.
- The Overall formula from the JSON file is honored without replacing it.
- No real-money gambling or betting systems were added.
- Character ownership is enforced in SQLite with unique constraints.

## Commands

- `/help`
- `/choose-character`
- `/profile`
- `/debug-db` (admin-only)

## Manual setup

1. Copy `.env.example` to `.env` and fill in the required values.
2. Ensure `blue_lock_characters.json` is present and valid.
3. Run:
   - `npm install`
   - `npm start`
4. Invite the bot to a Discord guild and use the slash commands.

## Database

The project uses SQLite via `better-sqlite3` for persistent user, profile, ownership, and collection data.

## Current status

This is the stable foundation phase only. Battle systems, 5v5 engine, advanced squads, and larger progression mechanics are intentionally not implemented yet.

## Known follow-up tasks

- Expand the JSON source database with the full official character list.
- Add richer energy recovery logic and mission reward tracking.
- Add full challenge and 1v1 match flow once rules are defined.
- Add localization coverage for English if needed.
