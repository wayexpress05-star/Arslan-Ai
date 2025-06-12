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
        await sock.sendMessage(chatId, { text: '🛰️ *Pinging...*' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);
        const uptimeFormatted = formatTime(process.uptime());

        const botInfo = `
╭━━━[ 🤖 *${settings.botName || 'Arslan-MD'}* ]━━━╮
┃ 🛰️ *Ping:* ${ping} ms
┃ ⏱️ *Uptime:* ${uptimeFormatted}
┃ 🧠 *Platform:* ${os.platform().toUpperCase()}
┃ 📦 *Version:* v${settings.version || '1.0.0'}
╰━━━━━━━━━━━━━━━━━━━━━━╯

✨ _I’m always ready to serve, boss!_
`.trim();

        await sock.sendMessage(chatId, { text: botInfo }, { quoted: message });

    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ *Ping failed.* Please try again later.'
        }, { quoted: message });
    }
}

module.exports = pingCommand;
