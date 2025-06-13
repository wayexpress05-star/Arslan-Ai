// 💥 Anti-Clone Security Check
const fs = require("fs");

const botName = "Arslan-MD";
const ownerNumber = "923237045919";

// 🚫 Block if tampered
if (__filename.includes('node_modules') === false) {
    const currentFile = fs.readFileSync(__filename, "utf8");
    if (!currentFile.includes(botName) || !currentFile.includes(ownerNumber)) {
        console.log(`
🚨 Unauthorized Clone Detected!

Bot settings have been modified.
Original Bot Name: ${botName}
Original Owner: ${ownerNumber}

❌ Shutting down...
        `);
        process.exit(1);
    }
}
const settings = {
  // 🤖 Identity & Branding
  botName: "Arslan-MD",
  packname: "Arslan-MD Pack",
  author: "ArslanMD Official",

  // 👑 Owner Info
  botOwner: "ArslanMD",
  ownerNumber: "923237045919", // No + or spaces

  // ⚙️ Mode & Compatibility (Old + New)
  commandMode: "public",   // ✅ legacy support
  MODE: "public",          // ✅ modern standard

  // 🔁 Toggles
  autoreact: true,         // ✅ auto reaction
  autotyping: false,
  autokick: false,
  chatbot: false,
  welcome: true,
  goodbye: true,
  antilink: false,

  // 🔐 API Keys & Media
  giphyApiKey: "qnl7ssQChTdPjsKta2Ax2LMaGXz303tq",
  openaiKey: "sk-xxxx",         // optional
  removeBgKey: "xxxxxx",        // optional
  menuGif: "ArslanMedia/media/menu.mp4",
  welcomeAudio: "ArslanMedia/audio/welcome.mp3",

  // 🌐 Metadata
  description: "🔥 The Most Powerful WhatsApp Bot by ArslanMD.",
  version: "2.0.2",             // ✅ for all commands
  website: "https://github.com/Arslan-MD/Arslan-MD",
  ytchannel: "https://youtube.com/@ArslanMD",
  repo: "https://github.com/Arslan-MD/Arslan-MD",

  // 🗣️ Voice Option (future)
  botVoice: "en-US-Wavenet-D"
};

// ✅ Backward Compatibility Support
settings.MODE = settings.MODE || settings.commandMode;

module.exports = settings;
