const os = require('os');
const process = require('process');

function formatUptime(seconds) {
    const pad = (s) => (s < 10 ? '0' + s : s);
    const hrs = pad(Math.floor(seconds / 3600));
    const mins = pad(Math.floor((seconds % 3600) / 60));
    const secs = pad(Math.floor(seconds % 60));
    return `${hrs}:${mins}:${secs}`;
}

async function aliveCommand(sock, chatId, message) {
    try {
        // 🧠 Global values
        const botName = global.botname || 'Arslan-MD';
        const version = global.version || '2.0.2';
        const owner = global.botOwner || global.ownerNumber || 'ArslanMD';
        const mode = global.commandMode || 'public';
        const uptime = formatUptime(process.uptime());

        // 📋 Main message
        const msg = `
🤖 *${botName} is Alive!*

📦 *Version:* ${version}
👑 *Owner:* ${owner}
🌐 *Mode:* ${mode}
💻 *Platform:* ${os.platform().toUpperCase()}
⏱️ *Uptime:* ${uptime}

_Select an option from below:_
        `.trim();

        // 🔘 Buttons
        const buttons = [
            { buttonId: '.menu', buttonText: { displayText: '📜 Menu' }, type: 1 },
            { buttonId: '.ping', buttonText: { displayText: '🏓 Ping' }, type: 1 },
            { buttonId: '.repo', buttonText: { displayText: '💻 Repo' }, type: 1 }
        ];

        // ✅ Send button message
        await sock.sendMessage(chatId, {
            text: msg,
            buttons,
            headerType: 4 // ✅ Updated from 1 to 4
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error in alive command:', error);
        await sock.sendMessage(chatId, {
            text: '⚠️ Arslan-MD is alive, but button failed to load.'
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
