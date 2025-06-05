const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const Pino = require('pino');
const express = require('express');
const config = require('./config');

async function startBot() {
  const authFolder = './session';

  // ✅ Restore session from ENV
  if (config.SESSION_ID && !fs.existsSync(`${authFolder}/creds.json`)) {
    try {
      fs.mkdirSync(authFolder, { recursive: true });
      const decoded = Buffer.from(config.SESSION_ID.replace('Sarkarmd$', ''), 'base64').toString();
      fs.writeFileSync(`${authFolder}/creds.json`, decoded);
      console.log("✅ Session restored from environment!");
    } catch (e) {
      console.log("❌ Session restore failed:", e.message);
    }
  }

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: "silent" }),
    browser: ["Arslan-MD", "Chrome", "110.0.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ Bot Connected Successfully!");
    } else if (connection === "close") {
      const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Session expired. Please re-pair.");
      }
    }
  });

  // ✅ Message Handler
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

    const prefix = config.PREFIX || '.';
    if (!text.startsWith(prefix)) return;

    const cmd = text.slice(prefix.length).trim().toLowerCase();

    if (cmd === 'ping') {
      await sock.sendMessage(from, { text: '🏓 Pong! Bot is active.' }, { quoted: m });
    }

    if (cmd === 'owner') {
      await sock.sendMessage(from, { text: `👑 Owner: wa.me/${config.OWNER_NUMBER}` }, { quoted: m });
    }

    if (cmd === 'menu') {
      await sock.sendMessage(from, {
        text: `📜 *Arslan-MD Command List:*
• .ping – Check bot status
• .owner – Get owner contact
• .repo – GitHub repo link`,
      }, { quoted: m });
    }

    if (cmd === 'repo') {
      await sock.sendMessage(from, {
        text: `🔗 GitHub Repo: ${config.REPO}`
      }, { quoted: m });
    }
  });
}

startBot();

// ✅ Express server to satisfy Render port
const app = express();
const PORT = process.env.PORT || 8000;
app.get('/', (req, res) => res.send('🟢 Arslan-MD Bot is Running...'));
app.listen(PORT, () => console.log(`🌐 Web server on port ${PORT}`));
