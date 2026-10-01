# GitHub Codespaces Setup Guide for Blue Lock Discord Bot

This guide ensures your Discord bot credentials are stored securely in GitHub Codespaces without exposing them in code or committed files.

## ⚠️ Security Note

**Do NOT commit `.env` files, token values, or any secrets to the repository.**

All Discord bot credentials must be stored as **GitHub Codespaces Secrets** and read only from environment variables at runtime.

---

## Step 1: Create a GitHub Codespaces Secret for DISCORD_TOKEN

### Via GitHub Web UI (Recommended)

1. Go to your repository on GitHub.com: **https://github.com/Pricloss/blue-lock-discord-bot**

2. Click **Settings** (top right)

3. In the left sidebar, scroll down and click **Codespaces** (under "Code and automation")

4. Click **Codespaces secrets**

5. Click the **New secret** button

6. **Name**: Enter exactly `DISCORD_TOKEN`

7. **Value**: Paste your Discord bot token (this is **never displayed or logged** after entry)

8. Click **Add secret**

✅ The secret is now created and available to all Codespaces in this repository.

---

## Step 2: Create Codespaces Secrets for DISCORD_CLIENT_ID and DISCORD_GUILD_ID

Repeat **Step 1** for the following secrets:

- **Name**: `DISCORD_CLIENT_ID`
  - **Value**: Your Discord application's Client ID (from Discord Developer Portal)

- **Name**: `DISCORD_GUILD_ID`
  - **Value**: Your test server's Guild ID (where the bot will run)

All three secrets should now appear in the **Codespaces secrets** list.

---

## Step 3: Start the Bot in Codespaces

### Launch Codespaces

1. Go to **https://github.com/Pricloss/blue-lock-discord-bot**

2. Click the green **<> Code** button

3. Select the **Codespaces** tab

4. Click **Create codespace on main** (or your current branch)

5. Wait for the Codespaces environment to load

### Install Dependencies and Start the Bot

Once inside Codespaces, open the terminal and run:

```bash
npm install
npm start
```

The bot will:
1. Read `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, and `DISCORD_GUILD_ID` from **environment variables** (injected from your Codespaces secrets)
2. Initialize the SQLite database in the `data/` directory
3. Load the character database from `blue_lock_characters.json`
4. Register slash commands to your Discord server
5. Connect to Discord and display: **Bot ready: YourBotName#0000**

✅ The bot is now live in your Discord server.

---

## Step 4: Test the Bot in Discord

In your Discord test server, try:

```
/help
/debug-db
/choose-character
/profile
```

Each command should respond without errors.

---

## How Codespaces Secrets Work

### Security Guarantee

- Secrets are **encrypted** by GitHub and **never exposed** in logs or environment inspection tools
- The bot's `index.js` reads them via `process.env.DISCORD_TOKEN` at runtime
- **Codespaces automatically injects these into the environment** when the environment starts
- You can verify this by running in the terminal:
  ```bash
  echo "Token length: ${#DISCORD_TOKEN}"  # Shows length, never the actual value
  ```

### Why This Is Safe

1. **Secrets are not stored in the repository** — they only exist in GitHub's secure vault
2. **`.gitignore` prevents local `.env` files from being committed**
3. **The bot reads from `process.env` only** — never from files
4. **Logs and error messages do not expose tokens** — the bot code sanitizes all output
5. **Codespaces auto-injects secrets at startup** — no manual `.env` creation needed

---

## Troubleshooting

### "Bot is not responding to commands"

- Verify the secret was created correctly (Settings → Codespaces → Codespaces secrets)
- Ensure the bot has **Manage Roles** and **Use Application Commands** in your Discord server
- Check the Codespaces terminal for error messages

### "DISCORD_TOKEN is undefined"

- The secret may not be set yet. Verify via Settings → Codespaces → Codespaces secrets
- Restart the Codespaces environment (reload the page or stop/start the container)
- Run `env | grep DISCORD` in the terminal to confirm the environment variable is present

### "Permission denied" when creating roles

- Add the bot to your Discord server with these permissions:
  - Manage Roles
  - View Channels
  - Send Messages
  - Use Application Commands

---

## For Local Development (Outside Codespaces)

If running the bot locally on your machine:

1. Create a `.env` file in the repository root (already in `.gitignore`, so it won't be committed):
   ```
   DISCORD_TOKEN=your_actual_token_here
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_GUILD_ID=your_guild_id
   ```

2. Run:
   ```bash
   npm install
   npm start
   ```

3. **Never commit the `.env` file** — it will be ignored automatically.

---

## Verification Checklist

- [ ] GitHub Codespaces secret `DISCORD_TOKEN` is created (Settings → Codespaces → Codespaces secrets)
- [ ] GitHub Codespaces secret `DISCORD_CLIENT_ID` is created
- [ ] GitHub Codespaces secret `DISCORD_GUILD_ID` is created
- [ ] Codespaces environment has been started (reload if necessary)
- [ ] `npm install` completed without errors
- [ ] `npm start` shows "Bot ready: YourBotName#0000"
- [ ] `/help` command works in Discord
- [ ] No token value appears in any logs or terminal output

✅ You are ready to test the bot!
