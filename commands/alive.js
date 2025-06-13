const settings = require("../settings");
const os = require("os");
const moment = require("moment");

const ALIVE_IMG = "https://i.imgur.com/kFZ5EwF.jpeg"; // ✅ HD image

function formatTime(seconds) {
    const d = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const h = Math.floor(seconds / 3600);
    seconds %= 3600;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

async function aliveCommand(sock, chatId, message) {
    try {
        const pushName = message?.pushName || message?.key?.fromMe ? "You" : "User";
        const time = moment().format("hh:mm A");
        const date = moment().format("dddd, MMMM Do YYYY");
        const uptime = formatTime(process.uptime());
        const mode = settings.MODE || settings.commandMode || "PUBLIC";
        const version = settings.version || "3.0";
        const platform = os.platform().toUpperCase();

        const caption = `
╭━━━〔 🤖 *Arslan-MD Status* 〕━━━⬣
┃ 👤 *User:* ${pushName}
┃ 🕒 *Time:* ${time}
┃ 📅 *Date:* ${date}
┃ ⏱️ *Uptime:* ${uptime}
┃ ⚙️ *Mode:* ${mode.toUpperCase()}
┃ 💻 *Platform:* ${platform}
┃ 🧩 *Version:* v${version}
┃ 👑 *Developer:* ${settings.botOwner || 'ArslanMD Official'}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣

✅ *Bot is alive and running like a pro!*
`.trim();

        // Try to send image with caption
        try {
            await sock.sendMessage(chatId, {
                image: { url: ALIVE_IMG },
                caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            }, { quoted: message });
        } catch (imgErr) {
            // fallback if image fails
            await sock.sendMessage(chatId, { text: caption }, { quoted: message });
        }

    } catch (err) {
        console.error("❌ Alive Command Error:", err);
        await sock.sendMessage(chatId, {
            text: '✅ Arslan-MD is alive, but detailed info failed to load.'
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
