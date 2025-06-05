const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const { Boom } = require('@hapi/boom');
const config = require('./config');
const fs = require('fs');

async function startBot() {
  const { state, saveState } = useSingleFileAuthState('./session.json');

  // ✅ Check and inject session from ENV
  if (config.SESSION_ID) {
    try {
      const decoded = Buffer.from(config.SESSION_ID.replace("Sarkarmd$", ""), 'base64').toString();
      fs.writeFileSync('./session.json', decoded);
      console.log("✅ Session restored from environment!");
    } catch (e) {
      console.log("❌ Failed to restore session:", e.message);
    }
  }

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: "silent" }),
    browser: ["Arslan-MD", "Chrome", "110.0.0.0"]
  });

  sock.ev.on("creds.update", saveState);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ Bot Connected Successfully!");
    } else if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startBot();
      } else {
        console.log("❌ Session expired. QR scan required.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

    if (text.toLowerCase() === '.ping') {
      await sock.sendMessage(from, { text: "🏓 Pong!" }, { quoted: m });
    }
  });
}

startBot();
