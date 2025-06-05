const config = {
  // 💼 Bot Identity
  BOT_NAME: "Arslan-MD",
  OWNER_NAME: "Arslan",
  OWNER_NUMBER: "923237045919", // Without '+'

  // ⚙️ Behavior Settings
  PREFIX: ".",
  LANG: "EN",
  PUBLIC_MODE: true,

  // 🔐 Session Settings
  SESSION_NAME: "session", // Folder where auth info is saved

  // 🚫 Protection Features
  AUTO_BLOCK: true,
  ANTI_DELETE: true,
  ANTI_LINK: true,

  // 🤖 Bot Behavior
  AUTO_REACT: false,
  CMD_DESC: true,

  // 🔗 Useful Links
  REPO: "https://github.com/ArslanMDofficial/Arslan-MD",

  // 🧠 AI Integration (Optional)
  OPENAI_KEY: "", // Add your OpenAI API Key here later

  // 🫂 Group Messages
  WELCOME_MSG: "👋 Welcome to the group!",
  GOODBYE_MSG: "👋 Goodbye! See you again.",
};

module.exports = config;
