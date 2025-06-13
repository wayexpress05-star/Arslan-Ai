const settings = require("../settings");
const os = require("os");
const moment = require("moment");
const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {
        const statusMessage = `
🤖 *${settings.botName || 'Arslan-MD'} is Alive!*

📦 Version: ${settings.version}
🧑‍💻 Owner: ${settings.botOwner}
🌐 Mode: ${settings.commandMode || 'public'}
💚 Status: Online & Operational
📅 Uptime: Always Active 🚀

_Select an option below to continue:_
        `.trim();

        const buttons = [
            { buttonId: '.menu', buttonText: { displayText: '📜 Menu' }, type: 1 },
            { buttonId: '.ping', buttonText: { displayText: '🏓 Ping' }, type: 1 },
            { buttonId: '.repo', buttonText: { displayText: '💻 Repo' }, type: 1 }
        ];

        await sock.sendMessage(chatId, {
            text: statusMessage,
            buttons: buttons,
            headerType: 1
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error in alive command:', error);
        await sock.sendMessage(chatId, {
            text: '⚠️ Bot is alive but buttons failed to load.'
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
