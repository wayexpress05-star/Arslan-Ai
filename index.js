const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const { Boom } = require("@hapi/boom");
const { execSync } = require("child_process");
const config = require("./config");

// Logger & Auth
const logger = pino({ level: "silent" });
const store = makeInMemoryStore({ logger });
store.readFromFile("./session/baileys_store.json");
setInterval(() => {
  store.writeToFile("./session/baileys_store.json");
}, 10000);

async function startArslanMD() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: true,
    auth: state,
    browser: ["Arslan-MD", "Chrome", "110.0.0.0"],
    defaultQueryTimeoutMs: undefined,
  });

  store.bind(sock.ev);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startArslanMD();
      }
    } else if (connection === "open") {
      console.log("✅ Bot Connected As", sock.user.name || sock.user.id);
    }
  });

  // Commands Handler
  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const m = messages[0];
      if (!m.message || m.key.fromMe) return;

      const from = m.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      const sender = m.key.participant || m.key.remoteJid;
      const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
      const prefix = config.PREFIX;
      const isCmd = body.startsWith(prefix);
      const command = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";
      const args = isCmd ? body.slice(prefix.length).trim().split(" ").slice(1) : [];

      switch (command) {
        case "ping":
          await sock.sendMessage(from, { text: "🏓 Pong! Bot is active." }, { quoted: m });
          break;

        case "owner":
          await sock.sendMessage(from, { text: `👑 My Owner: wa.me/${config.OWNER_NUMBER}` }, { quoted: m });
          break;

        case "menu":
          await sock.sendMessage(from, {
            text: `
╭━━⊰ *Arslan-MD Menu* ⊱━━⬣
┃⚙️ .ping
┃👑 .owner
┃📦 .repo
┃✏️ More coming soon...
╰━━━━━━━━━━━━━━⬣`
          }, { quoted: m });
          break;

        case "repo":
          await sock.sendMessage(from, {
            text: `📦 My GitHub Repository:\n${config.REPO}`
          }, { quoted: m });
          break;

        default:
          if (isCmd) {
            await sock.sendMessage(from, { text: "❌ Unknown command. Type .menu for help." }, { quoted: m });
          }
      }
    } catch (err) {
      console.error("❌ Command Handler Error:", err);
    }
  });
}

startArslanMD();
