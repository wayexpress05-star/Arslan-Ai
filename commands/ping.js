const os = require('os');
const settings = require('../settings.js');
const process = require('process');

function formatTime(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();

        const emojis = ['⚡', '🚀', '💨', '🎯', '🔥', '🎉', '🌟', '💥', '🧠'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        await sock.sendMessage(chatId, {
            react: { text: emoji, key: message.key }
        });

        const end = Date.now();
        const ping = Math.round((end - start) / 2);
        const uptime = formatTime(process.uptime());

        let speed = '🐢 Slow', color = '🔴';
        if (ping <= 100) speed = '🚀 Super Fast', color = '🟢';
        else if (ping <= 250) speed = '⚡ Fast', color = '🟡';
        else if (ping <= 500) speed = '⚠️ Medium', color = '🟠';

        const botInfo = `
╭━━〔 ⚙️ *Arslan-MD System Report* 〕━━⬣
┃
┃ 🛰️ *Response:* ${ping} ms ${emoji}
┃ 📶 *Speed:* ${color} ${speed}
┃ ⏱️ *Uptime:* ${uptime}
┃ 🧠 *Platform:* ${os.platform().toUpperCase()}
┃ 🧩 *NodeJS:* v${process.version.replace('v', '')}
┃ 🧪 *Bot Version:* v${settings.version || '3.0'}
┃ 💎 *Bot Name:* ${settings.botName || 'Arslan-MD'}
┃ 🔰 *Developer:* ${settings.botOwner || 'ArslanMD Official'}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣

_“Speed defines the legend. You’re flying with Arslan-MD.”_
`.trim();

        await sock.sendMessage(chatId, {
            text: botInfo
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Ping failed:', error);
        await sock.sendMessage(chatId, {
            text: '❌ *Ping error.* Please try again later.'
        }, { quoted: message });
    }
}

module.exports = pingCommand;
