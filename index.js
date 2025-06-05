const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys');

const { Boom } = require('@hapi/boom');
const Pino = require('pino');
const fs = require('fs');
const config = require('./config');

async function startBot() {
  const authFolder = './session';

  // ✅ Session from ENV
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
        console.log("❌ Session expired or logged out.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

    if (text.toLowerCase() === '.ping') {
      await sock.sendMessage(from, { text: "🏓 Pong! Bot is alive." }, { quoted: m });
    }
  });
}

startBot();

// ✅ Dummy server to satisfy Render port requirement
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('🟢 Arslan-MD WhatsApp Bot is running...');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
