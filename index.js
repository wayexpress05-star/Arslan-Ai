const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const Pino = require("pino");
const config = require("./config");
const { Boom } = require("@hapi/boom");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: "silent" }),
    browser: ["Arslan-MD", "Chrome", "110.0.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  // ✅ QR Show in Terminal
  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      console.log("🔐 Scan this QR to connect:\n", qr);
    }

    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Please restart and scan QR again.");
      }
    } else if (connection === "open") {
      console.log("✅ Bot Connected Successfully!");
    }
  });

  // ✅ Command Handler
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const text =
      m.message.conversation || m.message.extendedTextMessage?.text || "";
    const prefix = config.PREFIX;

    if (!text.startsWith(prefix)) return;

    const cmd = text.slice(prefix.length).trim().split(" ")[0].toLowerCase();

    if (cmd === "ping") {
      await sock.sendMessage(from, { text: "🏓 Pong!" }, { quoted: m });
    }

    if (cmd === "owner") {
      await sock.sendMessage(from, {
        text: `👑 Owner: wa.me/${config.OWNER_NUMBER}`
      }, { quoted: m });
    }

    if (cmd === "menu") {
      await sock.sendMessage(from, {
        text: `
╭───❍ *Arslan-MD Menu* ❍───
│ • .ping
│ • .owner
│ • .repo
╰────────────────────────`
      }, { quoted: m });
    }

    if (cmd === "repo") {
      await sock.sendMessage(from, {
        text: `📦 GitHub: ${config.REPO}`
      }, { quoted: m });
    }
  });
}

startBot();
