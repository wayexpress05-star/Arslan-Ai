const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();

        const emojis = ['⚡', '🚀', '💨', '🎯', '🧠', '🎉', '💥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        await sock.sendMessage(chatId, {
            react: { text: randomEmoji, key: message.key }
        });

        const end = Date.now();
        const ping = Math.round((end - start) / 2);
        const uptimeFormatted = formatTime(process.uptime());

        let badge = '🐢 Slow', color = '🔴';
        if (ping <= 150) {
            badge = '🚀 Super Fast'; color = '🟢';
        } else if (ping <= 300) {
            badge = '⚡ Fast'; color = '🟡';
        } else if (ping <= 600) {
            badge = '⚠️ Medium'; color = '🟠';
        }

        const botInfo = `
╭━━━〔 🤖 *${settings.botName || 'Arslan-MD'} Status* 〕━━⬣
┃ 🛰️ *Ping:* ${ping} ms
┃ 📶 *Speed:* ${color} ${badge}
┃ ⏱️ *Uptime:* ${uptimeFormatted}
┃ 💻 *Platform:* ${os.platform().toUpperCase()}
┃ 📦 *Version:* v${settings.version || '1.0.0'}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
✨ _I'm always ready to serve, boss!_
`.trim();

        await sock.sendMessage(chatId, {
            text: botInfo
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error in ping command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ *Ping failed.* Please try again later.'
        }, { quoted: message });
    }
}

module.exports = pingCommand;
