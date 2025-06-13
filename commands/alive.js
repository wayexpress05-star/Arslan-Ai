const settings = require("../settings");
const os = require("os");
const moment = require("moment");

const ALIVE_IMG = "https://i.imgur.com/kFZ5EwF.jpeg"; // ✅ Change to your custom image

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function aliveCommand(sock, chatId, message) {
    try {
        const pushName = message.pushName || "User";
        const time = moment().format("hh:mm A");
        const date = moment().format("dddd, MMMM Do YYYY");
        const uptime = formatTime(process.uptime());
        const mode = settings.MODE?.toUpperCase() || 'PUBLIC';
        const version = settings.version || '3.0';
        const platform = os.platform().toUpperCase();

        const caption = `
╭━━━〔 🤖 *Arslan-MD System Status* 〕━━━⬣
┃ 🧑‍💻 *Hello:* ${pushName}
┃ 🕒 *Time:* ${time}
┃ 📅 *Date:* ${date}
┃ ⏱️ *Uptime:* ${uptime}
┃ ⚙️ *Mode:* ${mode}
┃ 💻 *Platform:* ${platform}
┃ 🧩 *Bot Version:* v${version}
┃ 👑 *Developer:* ${settings.botOwner || 'ArslanMD Official'}
┃
┃ 🌟 *Main Features:*
┃ ┣ 📂 Group Tools + Moderation
┃ ┣ 🤖 AI Chat + GPT & Gemini
┃ ┣ 🎮 Games, Fun, Convertors
┃ ┣ 📥 Instagram/YouTube Downloader
┃ ┗ 🧠 Utilities, Quran, Info Tools
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣

🔰 *Arslan-MD is Active, Responsive, and Royal as Always!*
💡 _Type *.menu* to explore full power_
        `.trim();

        await sock.sendMessage(chatId, {
            image: { url: ALIVE_IMG },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: message });

    } catch (err) {
        console.error('❌ Alive Command Error:', err);
        await sock.sendMessage(chatId, {
            text: '✅ Arslan-MD is alive, but detailed info failed to load.'
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
