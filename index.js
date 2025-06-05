const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { useSingleFileAuthState } = require('@whiskeysockets/baileys/lib/auth-utils');
const { Boom } = require('@hapi/boom');
const Pino = require('pino');
const fs = require('fs');
const config = require('./config');

async function startBot() {
  const sessionFile = './session.json';

  if (config.SESSION_ID && !fs.existsSync(sessionFile)) {
    try {
      const decoded = Buffer.from(config.SESSION_ID.replace('Sarkarmd$', ''), 'base64').toString();
      fs.writeFileSync(sessionFile, decoded);
      console.log("✅ Session restored from environment!");
    } catch (e) {
      console.error("❌ Failed to write session.json:", e.message);
    }
  }

  const { state, saveCreds } = useSingleFileAuthState(sessionFile);
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
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Session expired. Please re-pair.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

    if (text.toLowerCase() === '.ping') {
      await sock.sendMessage(from, { text: "🏓 Pong! Bot is active." }, { quoted: m });
    }
  });
}

startBot();
